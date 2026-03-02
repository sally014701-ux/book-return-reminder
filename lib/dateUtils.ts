/**
 * 반납일 = 대출일 + 대출 기간
 * 남은 일수 = 반납일 - 오늘 (날짜만 기준)
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getReturnDate(borrowDate: Date, loanDays: number): Date {
  return addDays(borrowDate, loanDays);
}

/** 오늘 날짜만 (자정 UTC 로컬) */
export function todayDate(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

/** 날짜를 YYYY-MM-DD 로 */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 두 날짜 사이 일수 (날짜만 기준, 반납일 - 오늘) */
export function daysBetween(from: Date, to: Date): number {
  const fromDay = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const toDay = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((toDay - fromDay) / (24 * 60 * 60 * 1000));
}

/** 남은 일수: 양수면 D-N, 0이면 D-Day, 음수면 연체 N일 */
export function daysRemaining(returnDate: Date): number {
  return daysBetween(todayDate(), returnDate);
}

/** YYYY-MM-DD 문자열을 Date로 (로컬 자정) */
export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
