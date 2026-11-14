import type { IPayment } from "../../models/Payment";

export interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at?: string;
  expires_in?: number;
}

export interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: string;
  transaction_id: string | null;
  fee?: number;
  refunded?: boolean;
}

interface KhaltiCustomer {
  name: string;
  email: string;
  phone?: string;
}

function getConfig() {
  const secretKey = process.env.KHALTI_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error(
      "Khalti is not configured. Set KHALTI_SECRET_KEY.",
    );
  }

  const production = process.env.KHALTI_ENVIRONMENT === "production";

  return {
    secretKey,
    baseUrl: production
      ? "https://khalti.com/api/v2/"
      : "https://dev.khalti.com/api/v2/",
  };
}

export async function initiateKhaltiPayment(
  payment: Pick<
    IPayment,
    "reference" | "planName" | "amountNpr"
  >,
  customer: KhaltiCustomer,
): Promise<KhaltiInitiateResponse> {
  const config = getConfig();
  const clientUrl = process.env.CLIENT_URL?.trim();

  if (!clientUrl) {
    throw new Error("CLIENT_URL is not configured.");
  }

  const response = await fetch(`${config.baseUrl}epayment/initiate/`, {
    method: "POST",
    headers: {
      Authorization: `Key ${config.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: `${clientUrl}/payment/success`,
      website_url: clientUrl,
      amount: Math.round(payment.amountNpr * 100),
      purchase_order_id: payment.reference,
      purchase_order_name: payment.planName,
      customer_info: {
        name: customer.name,
        email: customer.email,
        ...(customer.phone ? { phone: customer.phone } : {}),
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const body = (await response.json()) as KhaltiInitiateResponse & {
    detail?: string;
    error_key?: string;
  };

  if (!response.ok || !body.pidx || !body.payment_url) {
    throw new Error(
      body.detail || body.error_key || "Khalti could not start the payment.",
    );
  }

  return body;
}

export async function lookupKhaltiPayment(
  pidx: string,
): Promise<KhaltiLookupResponse | null> {
  const config = getConfig();

  const response = await fetch(`${config.baseUrl}epayment/lookup/`, {
    method: "POST",
    headers: {
      Authorization: `Key ${config.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as KhaltiLookupResponse;
}
