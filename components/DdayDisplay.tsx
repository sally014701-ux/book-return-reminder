"use client";

import { formatDate, daysRemaining } from "@/lib/dateUtils";

type Props = {
  returnDate: Date;
};

export default function DdayDisplay({ returnDate }: Props) {
  const remaining = daysRemaining(returnDate);
  const returnDateStr = formatDate(returnDate);

  let label: string;
  if (remaining > 0) {
    label = `D-${remaining}`;
  } else if (remaining === 0) {
    label = "오늘 반납일입니다 (D-Day)";
  } else {
    label = `연체 ${-remaining}일`;
  }

  const isOverdue = remaining < 0;
  const isUrgent = remaining >= 0 && remaining <= 3;
  const isNormal = remaining > 3;

  const colorClass = isOverdue
    ? "text-red-900 bg-red-100 border-red-300"
    : isUrgent
      ? "text-red-700 bg-red-50 border-red-200"
      : "text-gray-800 bg-gray-50 border-gray-200";

  return (
    <div className="rounded-2xl border-2 p-8 text-center shadow-sm">
      <div className={`mb-2 text-4xl font-bold tracking-tight md:text-5xl ${colorClass} rounded-xl border py-4`}>
        {remaining > 0 ? label : remaining === 0 ? "D-Day" : label}
      </div>
      {remaining === 0 && (
        <p className="mb-2 text-lg font-medium text-gray-700">오늘 반납일입니다 (D-Day)</p>
      )}
      <p className="text-gray-600">반납일: {returnDateStr}</p>
    </div>
  );
}
