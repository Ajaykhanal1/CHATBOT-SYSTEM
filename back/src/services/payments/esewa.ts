import crypto from "crypto";
import type { IPayment } from "../../models/Payment";

export interface EsewaCallbackPayload {
  transaction_code?: string;
  status?: string;
  total_amount?: string;
  transaction_uuid?: string;
  product_code?: string;
  signed_field_names?: string;
  signature?: string;
  [key: string]: unknown;
}

export interface EsewaStatusResponse {
  product_code?: string;
  transaction_uuid?: string;
  total_amount?: string | number;
  status?: string;
  ref_id?: string | null;
}

function getConfig() {
  const production = process.env.ESEWA_ENVIRONMENT === "production";
  const productCode = process.env.ESEWA_MERCHANT_CODE?.trim();
  const secretKey = process.env.ESEWA_SECRET_KEY?.trim();

  if (!productCode || !secretKey) {
    throw new Error(
      "eSewa is not configured. Set ESEWA_MERCHANT_CODE and ESEWA_SECRET_KEY.",
    );
  }

  return {
    productCode,
    secretKey,
    formUrl:
      process.env.ESEWA_FORM_URL?.trim() ||
      (production
        ? "https://epay.esewa.com.np/api/epay/main/v2/form"
        : "https://rc-epay.esewa.com.np/api/epay/main/v2/form"),
    statusUrl:
      process.env.ESEWA_STATUS_URL?.trim() ||
      (production
        ? "https://esewa.com.np/api/epay/transaction/status/"
        : "https://rc.esewa.com.np/api/epay/transaction/status/"),
  };
}

function signFields(
  fields: Record<string, unknown>,
  signedFieldNames: string,
): string {
  const message = signedFieldNames
    .split(",")
    .map((name) => `${name}=${String(fields[name] ?? "")}`)
    .join(",");

  return crypto
    .createHmac("sha256", getConfig().secretKey)
    .update(message)
    .digest("base64");
}

export function createEsewaCheckout(
  payment: Pick<IPayment, "reference" | "amountNpr">,
  successUrl: string,
  failureUrl: string,
) {
  const config = getConfig();
  const totalAmount = payment.amountNpr.toFixed(2);

  const fields: Record<string, string> = {
    amount: totalAmount,
    tax_amount: "0",
    total_amount: totalAmount,
    transaction_uuid: payment.reference,
    product_code: config.productCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };

  fields.signature = signFields(fields, fields.signed_field_names);

  return { action: config.formUrl, fields };
}

export function decodeEsewaCallback(raw: string): EsewaCallbackPayload | null {
  try {
    // A URL parser can turn "+" into a space in the Base64 payload.
    const normalized = raw.replace(/ /g, "+");
    const decoded = Buffer.from(normalized, "base64").toString("utf8");
    const payload = JSON.parse(decoded) as unknown;

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return null;
    }

    return payload as EsewaCallbackPayload;
  } catch {
    return null;
  }
}

export function verifyEsewaCallbackSignature(
  payload: EsewaCallbackPayload,
): boolean {
  const signedFieldNames = String(payload.signed_field_names ?? "");
  const required = [
    "status",
    "total_amount",
    "transaction_uuid",
    "product_code",
  ];
  const names = signedFieldNames
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (!required.every((field) => names.includes(field))) {
    return false;
  }

  const expected = Buffer.from(signFields(payload, signedFieldNames));
  const given = Buffer.from(String(payload.signature ?? ""));

  return (
    expected.length === given.length &&
    crypto.timingSafeEqual(expected, given)
  );
}

export async function lookupEsewaStatus(
  reference: string,
  amountNpr: number,
): Promise<EsewaStatusResponse | null> {
  const config = getConfig();
  const url = new URL(config.statusUrl);

  url.searchParams.set("product_code", config.productCode);
  url.searchParams.set("total_amount", amountNpr.toFixed(2));
  url.searchParams.set("transaction_uuid", reference);

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as EsewaStatusResponse & {
    error_message?: string;
  };

  if (body.error_message || !body.status) {
    return null;
  }

  return body;
}
