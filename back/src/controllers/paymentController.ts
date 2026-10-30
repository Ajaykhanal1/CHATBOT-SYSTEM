import { Request, Response } from "express";
import { ZodError } from "zod";

import { Payment, type IPayment } from "../models/Payment";
import { User } from "../models/user.model";
import { getPlan } from "../services/payments/plans";
import {
  createPaymentReference,
  roundNpr,
} from "../services/payments/reference";
import {
  ExchangeRateError,
  getUsdNprRate,
} from "../services/payments/exchangeRate";
import {
  createEsewaCheckout,
  decodeEsewaCallback,
  lookupEsewaStatus,
  verifyEsewaCallbackSignature,
  type EsewaCallbackPayload,
} from "../services/payments/esewa";
import {
  initiateKhaltiPayment,
  lookupKhaltiPayment,
} from "../services/payments/khalti";
import { getActiveAccess } from "../services/payments/access";
import {
  esewaCallbackSchema,
  esewaFailureSchema,
  initiatePaymentSchema,
  khaltiCallbackSchema,
  quoteSchema,
} from "../validators/payment.validator";

const PAYMENT_TTL_MINUTES = 30;

function getClientUrl(): string {
  const clientUrl = process.env.CLIENT_URL?.trim().replace(/\/+$/, "");

  if (!clientUrl) {
    throw new Error("CLIENT_URL is not configured.");
  }

  return clientUrl;
}

function paymentView(payment: IPayment) {
  return {
    reference: payment.reference,
    planId: payment.planId,
    planName: payment.planName,
    provider: payment.provider,
    status: payment.status,
    amountUsd: payment.amountUsd,
    amountNpr: payment.amountNpr,
    currency: payment.currency,
    exchangeRate: payment.exchangeRate,
    rateDate: payment.rateDate,
    paidAt: payment.paidAt ?? null,
    accessEndsAt: payment.accessEndsAt ?? null,
  };
}

function amountFromGateway(value: unknown): number {
  return Number(String(value ?? "").replace(/,/g, ""));
}

function amountsMatch(gatewayAmount: number, expected: number): boolean {
  return (
    Number.isFinite(gatewayAmount) &&
    Math.abs(gatewayAmount - expected) < 0.01
  );
}

function isExpired(payment: IPayment): boolean {
  return payment.status === "pending" && payment.expiresAt.getTime() < Date.now();
}

async function setPaymentStatus(
  payment: IPayment,
  status: IPayment["status"],
  reason: string,
  rawResponse?: unknown,
): Promise<IPayment | null> {
  const updated = await Payment.findOneAndUpdate(
    { _id: payment._id, status: "pending" },
    {
      $set: {
        status,
        failureReason: reason,
        ...(rawResponse === undefined ? {} : { rawResponse }),
      },
    },
    { returnDocument: "after" },
  );

  return updated ?? Payment.findById(payment._id);
}

/**
 * Atomically moves a pending payment to paid and stores its access window.
 * The access window lives on the payment document, so one compare-and-set is
 * enough to make both the payment and the entitlement consistent.
 */
async function activatePayment(
  payment: IPayment,
  providerTxnId: string | null,
  rawResponse: unknown,
): Promise<IPayment> {
  const plan = getPlan(payment.planId);

  if (!plan) {
    throw new Error("Unknown plan on payment.");
  }

  const current = await getActiveAccess(payment.userId.toString());
  const now = new Date();

  let accessStartsAt = now;

  // Renewing the same plan extends it instead of throwing away unused days.
  if (current.plan === plan.id && current.expiresAt) {
    const currentEnd = new Date(current.expiresAt);

    if (currentEnd > now) {
      accessStartsAt = currentEnd;
    }
  }

  const accessEndsAt = new Date(
    accessStartsAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
  );

  const updated = await Payment.findOneAndUpdate(
    { _id: payment._id, status: "pending" },
    {
      $set: {
        status: "paid",
        providerTxnId: providerTxnId ?? undefined,
        rawResponse,
        paidAt: now,
        accessStartsAt,
        accessEndsAt,
      },
      $unset: { failureReason: 1 },
    },
    { returnDocument: "after" },
  );

  if (updated) {
    return updated;
  }

  const existing = await Payment.findById(payment._id);

  if (existing?.status === "paid") {
    return existing;
  }

  throw new Error("Payment is no longer pending.");
}

function handleError(res: Response, error: unknown): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Invalid payment request.",
      errors: error.issues.map((issue) => issue.message),
    });
    return;
  }

  if (error instanceof ExchangeRateError) {
    res.status(503).json({ success: false, message: error.message });
    return;
  }

  console.error("PAYMENT ERROR:", error);

  res.status(500).json({
    success: false,
    message: "Something went wrong while processing the payment.",
  });
}

export const getQuote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { plan: planId } = quoteSchema.parse(req.query);
    const plan = getPlan(planId);

    if (!plan) {
      res.status(404).json({ success: false, message: "Unknown plan." });
      return;
    }

    const [rate, access] = await Promise.all([
      getUsdNprRate(),
      getActiveAccess(req.user.id),
    ]);

    res.json({
      success: true,
      plan,
      exchangeRate: rate,
      amountNpr: roundNpr(plan.amountUsd * rate.rate),
      access,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const initiatePayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  let payment: IPayment | null = null;

  try {
    const { planId, provider, phone } = initiatePaymentSchema.parse(req.body);
    const plan = getPlan(planId);

    if (!plan) {
      res.status(404).json({ success: false, message: "Unknown plan." });
      return;
    }

    const access = await getActiveAccess(req.user.id);

    if (access.plan === plan.id || access.plan === "business") {
      res.status(200).json({
        success: true,
        alreadyActive: true,
        access,
      });
      return;
    }

    const rate = await getUsdNprRate();
    const amountNpr = roundNpr(plan.amountUsd * rate.rate);
    const clientUrl = getClientUrl();

    for (let attempt = 0; attempt < 3 && !payment; attempt += 1) {
      try {
        payment = await Payment.create({
          userId: req.user.id,
          reference: createPaymentReference(),
          planId: plan.id,
          planName: plan.name,
          provider,
          status: "pending",
          amountUsd: plan.amountUsd,
          exchangeRate: rate.rate,
          rateDate: rate.rateDate,
          rateSource: rate.source,
          rateFallback: rate.fallback,
          amountNpr,
          currency: "NPR",
          expiresAt: new Date(Date.now() + PAYMENT_TTL_MINUTES * 60 * 1000),
        });
      } catch (error) {
        const duplicate =
          error instanceof Error &&
          "code" in error &&
          (error as { code?: number }).code === 11000;

        if (!duplicate || attempt === 2) {
          throw error;
        }
      }
    }

    if (!payment) {
      throw new Error("Could not create a payment reference.");
    }

    if (provider === "esewa") {
      const checkout = createEsewaCheckout(
        payment,
        `${clientUrl}/payment/success`,
        `${clientUrl}/payment/failure`,
      );

      console.log("eSewa payment initiated:", payment.reference);

      res.status(201).json({
        success: true,
        alreadyActive: false,
        reference: payment.reference,
        method: "esewa",
        action: checkout.action,
        fields: checkout.fields,
      });
      return;
    }

    const user = await User.findById(req.user.id).select("name email");

    const khalti = await initiateKhaltiPayment(payment, {
      name: user?.name || req.user.email,
      email: user?.email || req.user.email,
      phone,
    });

    payment.providerRef = khalti.pidx;
    payment.rawResponse = khalti;
    await payment.save();

    console.log("Khalti payment initiated:", payment.reference, khalti.pidx);

    res.status(201).json({
      success: true,
      alreadyActive: false,
      reference: payment.reference,
      method: "khalti",
      paymentUrl: khalti.payment_url,
    });
  } catch (error) {
    if (payment && payment.status === "pending") {
      await setPaymentStatus(
        payment,
        "failed",
        error instanceof Error ? error.message : "Gateway initiation failed.",
      ).catch(() => undefined);
    }

    if (error instanceof ZodError || error instanceof ExchangeRateError) {
      handleError(res, error);
      return;
    }

    console.error("PAYMENT INITIATION ERROR:", error);

    res.status(502).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not start the payment. Please try again.",
    });
  }
};

export const verifyEsewaPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data } = esewaCallbackSchema.parse(req.body);
    const payload = decodeEsewaCallback(data);

    if (!payload) {
      res.status(400).json({
        success: false,
        message: "Invalid eSewa response.",
      });
      return;
    }

    if (!verifyEsewaCallbackSignature(payload)) {
      res.status(400).json({
        success: false,
        message: "eSewa response signature is invalid.",
      });
      return;
    }

    const productCode = process.env.ESEWA_MERCHANT_CODE?.trim();

    if (productCode && payload.product_code !== productCode) {
      res.status(400).json({
        success: false,
        message: "eSewa merchant code does not match.",
      });
      return;
    }

    const reference = String(payload.transaction_uuid ?? "");
    const payment = await Payment.findOne({
      reference,
      userId: req.user.id,
      provider: "esewa",
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: "Payment not found for this account.",
      });
      return;
    }

    if (payment.status === "paid") {
      res.json({
        success: true,
        status: "paid",
        payment: paymentView(payment),
      });
      return;
    }

    if (isExpired(payment)) {
      const expired = await setPaymentStatus(
        payment,
        "expired",
        "Payment session expired.",
        payload,
      );

      res.json({
        success: false,
        status: "expired",
        payment: expired ? paymentView(expired) : null,
      });
      return;
    }

    const callbackAmount = amountFromGateway(payload.total_amount);

    if (!amountsMatch(callbackAmount, payment.amountNpr)) {
      const failed = await setPaymentStatus(
        payment,
        "failed",
        "Amount returned by eSewa did not match the payment.",
        payload,
      );

      res.status(400).json({
        success: false,
        status: "failed",
        message: "Payment amount did not match.",
        payment: failed ? paymentView(failed) : null,
      });
      return;
    }

    if (payload.status !== "COMPLETE") {
      const status = String(payload.status ?? "").includes("CANCEL")
        ? "cancelled"
        : "failed";
      const updated = await setPaymentStatus(
        payment,
        status,
        `eSewa returned ${payload.status ?? "an unknown status"}.`,
        payload,
      );

      res.json({
        success: false,
        status,
        payment: updated ? paymentView(updated) : null,
      });
      return;
    }

    // Never trust the browser redirect: confirm server-to-server.
    const statusResponse = await lookupEsewaStatus(
      payment.reference,
      payment.amountNpr,
    );

    if (!statusResponse) {
      res.status(502).json({
        success: false,
        status: "pending",
        message:
          "eSewa could not confirm this payment yet. Please check again shortly.",
      });
      return;
    }

    if (statusResponse.status !== "COMPLETE") {
      const status =
        statusResponse.status === "PENDING"
          ? "pending"
          : statusResponse.status === "CANCELED"
            ? "cancelled"
            : statusResponse.status === "NOT_FOUND"
              ? "expired"
              : "failed";

      if (status !== "pending") {
        await setPaymentStatus(
          payment,
          status,
          `eSewa status: ${statusResponse.status}`,
          statusResponse,
        );
      }

      res.json({
        success: false,
        status,
        message: `eSewa status: ${statusResponse.status}`,
        payment: paymentView(payment),
      });
      return;
    }

    if (
      statusResponse.transaction_uuid !== payment.reference ||
      !amountsMatch(
        amountFromGateway(statusResponse.total_amount),
        payment.amountNpr,
      )
    ) {
      const failed = await setPaymentStatus(
        payment,
        "failed",
        "eSewa status response did not match the payment.",
        statusResponse,
      );

      res.status(400).json({
        success: false,
        status: "failed",
        message: "eSewa verification did not match this payment.",
        payment: failed ? paymentView(failed) : null,
      });
      return;
    }

    const paid = await activatePayment(
      payment,
      statusResponse.ref_id ?? null,
      statusResponse,
    );

    console.log("eSewa payment verified:", paid.reference, paid.providerTxnId);

    res.json({
      success: true,
      status: "paid",
      payment: paymentView(paid),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyKhaltiPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { pidx } = khaltiCallbackSchema.parse(req.body);
    const payment = await Payment.findOne({
      providerRef: pidx,
      provider: "khalti",
      userId: req.user.id,
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: "Payment not found for this account.",
      });
      return;
    }

    if (payment.status === "paid") {
      res.json({
        success: true,
        status: "paid",
        payment: paymentView(payment),
      });
      return;
    }

    if (isExpired(payment)) {
      const expired = await setPaymentStatus(
        payment,
        "expired",
        "Payment session expired.",
      );

      res.json({
        success: false,
        status: "expired",
        payment: expired ? paymentView(expired) : null,
      });
      return;
    }

    // Khalti's lookup API is the source of truth, not the return URL.
    const lookup = await lookupKhaltiPayment(pidx);

    if (!lookup) {
      res.status(502).json({
        success: false,
        status: "pending",
        message:
          "Khalti could not confirm this payment yet. Please check again shortly.",
      });
      return;
    }

    const expectedPaisa = Math.round(payment.amountNpr * 100);

    if (lookup.status === "Completed") {
      if (lookup.pidx !== pidx || lookup.total_amount !== expectedPaisa) {
        const failed = await setPaymentStatus(
          payment,
          "failed",
          "Khalti lookup amount did not match the payment.",
          lookup,
        );

        res.status(400).json({
          success: false,
          status: "failed",
          message: "Khalti verification did not match this payment.",
          payment: failed ? paymentView(failed) : null,
        });
        return;
      }

      const paid = await activatePayment(
        payment,
        lookup.transaction_id,
        lookup,
      );

      console.log(
        "Khalti payment verified:",
        paid.reference,
        paid.providerTxnId,
      );

      res.json({
        success: true,
        status: "paid",
        payment: paymentView(paid),
      });
      return;
    }

    const statusMap: Record<string, IPayment["status"]> = {
      "User canceled": "cancelled",
      Expired: "expired",
      Refunded: "failed",
      "Partially Refunded": "failed",
    };

    const status = statusMap[lookup.status];

    if (status) {
      const updated = await setPaymentStatus(
        payment,
        status,
        `Khalti status: ${lookup.status}`,
        lookup,
      );

      res.json({
        success: false,
        status,
        payment: updated ? paymentView(updated) : null,
      });
      return;
    }

    res.json({
      success: false,
      status: "pending",
      message: `Khalti status: ${lookup.status}`,
      payment: paymentView(payment),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const failEsewaPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data } = esewaFailureSchema.parse(req.body);

    if (!data) {
      res.json({ success: true, status: "cancelled" });
      return;
    }

    const payload: EsewaCallbackPayload | null = decodeEsewaCallback(data);
    const reference = String(payload?.transaction_uuid ?? "");

    if (reference) {
      const payment = await Payment.findOne({
        reference,
        userId: req.user.id,
        provider: "esewa",
      });

      if (payment && payment.status === "pending") {
        await setPaymentStatus(
          payment,
          "cancelled",
          "Payment cancelled or failed at eSewa.",
          payload,
        );
      }
    }

    res.json({ success: true, status: "cancelled" });
  } catch (error) {
    handleError(res, error);
  }
};

export const getPaymentAccess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const access = await getActiveAccess(req.user.id);
    res.json({ success: true, ...access });
  } catch (error) {
    handleError(res, error);
  }
};
