import { NextRequest, NextResponse } from "next/server";
import { getAllReminders, markSent } from "@/lib/store";
import { sendReminderEmail } from "@/lib/email";
import { daysRemaining, parseDateStr } from "@/lib/dateUtils";

/**
 * Vercel Cron에서 매일 호출하여 D-3, D-1, D-0 이메일 발송.
 * vercel.json에 cron 스케줄을 추가하세요 (예: 매일 09:00).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reminders = getAllReminders();
  const results: { id: string; sent?: string; error?: string }[] = [];

  for (const r of reminders) {
    const returnDate = parseDateStr(r.returnDate);
    const remaining = daysRemaining(returnDate);

    if (remaining === 3 && !r.sentD3) {
      const result = await sendReminderEmail({
        to: r.email,
        returnDate: r.returnDate,
        daysLeft: 3,
      });
      if (result.ok) {
        markSent(r.id, "sentD3");
        results.push({ id: r.id, sent: "D-3" });
      } else {
        results.push({ id: r.id, error: result.error });
      }
    } else if (remaining === 1 && !r.sentD1) {
      const result = await sendReminderEmail({
        to: r.email,
        returnDate: r.returnDate,
        daysLeft: 1,
      });
      if (result.ok) {
        markSent(r.id, "sentD1");
        results.push({ id: r.id, sent: "D-1" });
      } else {
        results.push({ id: r.id, error: result.error });
      }
    } else if (remaining === 0 && !r.sentD0) {
      const result = await sendReminderEmail({
        to: r.email,
        returnDate: r.returnDate,
        daysLeft: 0,
      });
      if (result.ok) {
        markSent(r.id, "sentD0");
        results.push({ id: r.id, sent: "D-0" });
      } else {
        results.push({ id: r.id, error: result.error });
      }
    }
  }

  return NextResponse.json({ ok: true, results });
}
