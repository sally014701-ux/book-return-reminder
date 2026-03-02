import { NextRequest, NextResponse } from "next/server";
import { saveReminder } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, borrowDate, returnDate } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
    }
    if (!borrowDate || !returnDate) {
      return NextResponse.json({ error: "대출일과 반납일이 필요합니다." }, { status: 400 });
    }

    const record = saveReminder({
      email: email.trim(),
      borrowDate: String(borrowDate),
      returnDate: String(returnDate),
    });
    return NextResponse.json({ id: record.id, returnDate: record.returnDate });
  } catch {
    return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 });
  }
}
