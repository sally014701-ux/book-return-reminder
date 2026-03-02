import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export type ReminderPayload = {
  to: string;
  returnDate: string; // YYYY-MM-DD
  daysLeft: number;
};

export async function sendReminderEmail(payload: ReminderPayload): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }

  const subject = "📚 책 반납일이 다가오고 있어요";
  const daysText =
    payload.daysLeft > 0
      ? `반납일까지 ${payload.daysLeft}일 남았습니다.`
      : payload.daysLeft === 0
        ? "오늘이 반납일입니다."
        : `연체 ${-payload.daysLeft}일입니다.`;

  const body = `${daysText}
반납일: ${payload.returnDate}
미리 준비해주세요.`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: payload.to,
      subject,
      text: body,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}
