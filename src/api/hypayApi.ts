export type CreatePaymentPayload = {
  amount: number;
  orderId?: string;
  info?: string;

  userId?: string;
  clientName?: string;
  clientLName?: string;
  email?: string;
  phone?: string;
  cell?: string;
  street?: string;
  city?: string;
  zip?: string;

  tmp?: number; 
  pageLang?: "HEB" | "ENG";
  coin?: 1 | 2 | 3 | 4;
  sendHesh?: boolean;
  sendEmail?: boolean;
  pritim?: boolean;
  heshDesc?: string;
};

export type CreatePaymentResponse =
  | {
      ok: true;
      paymentUrl: string;
      orderId: string;
      recommendedRedirects: { successUrl: string; failureUrl: string; cancelUrl: string };
    }
  | { ok: false; message: string };

export async function createHypPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResponse> {
  const base = import.meta.env.VITE_API_URL as string;
  const res = await fetch(`${base}/api/hyp/create-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return (await res.json()) as CreatePaymentResponse;
}

export type VerifyResponse =
  | { ok: true; verified: boolean; ccode: string; data: Record<string, string>; raw: string }
  | { ok: false; message: string };

export async function verifyHypPayment(search: string): Promise<VerifyResponse> {
  const base = import.meta.env.VITE_API_URL as string;
  const qs = search.startsWith("?") ? search : `?${search}`;
  const res = await fetch(`${base}/api/hyp/verify${qs}`, { method: "GET" });
  return (await res.json()) as VerifyResponse;
}
