"use client";

import { useState } from "react";
import { getReturnDate, formatDate, todayDate } from "@/lib/dateUtils";
import DdayDisplay from "@/components/DdayDisplay";

const LOAN_PERIODS = [7, 14, 21, 30] as const;

export default function Home() {
  const [email, setEmail] = useState("");
  const [borrowDateStr, setBorrowDateStr] = useState("");
  const [loanDays, setLoanDays] = useState<number>(14);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const todayStr = formatDate(todayDate());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!borrowDateStr) {
      setError("대출일을 선택해주세요.");
      return;
    }
    const borrowDate = new Date(borrowDateStr + "T12:00:00");
    const returnDt = getReturnDate(borrowDate, loanDays);
    setReturnDate(returnDt);
    setLoading(true);
    try {
      const res = await fetch("/api/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          borrowDate: borrowDateStr,
          returnDate: formatDate(returnDt),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">
        📚 반납일 리마인더
      </h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="borrowDate" className="mb-1 block text-sm font-medium text-gray-700">
              대출일
            </label>
            <input
              id="borrowDate"
              type="date"
              value={borrowDateStr}
              onChange={(e) => setBorrowDateStr(e.target.value)}
              max={todayStr}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              대출 기간
            </label>
            <div className="flex gap-2">
              {LOAN_PERIODS.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setLoanDays(days)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                    loanDays === days
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {days}일
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-800 py-3 font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "저장 중…" : "반납일 설정하기"}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {returnDate && <DdayDisplay returnDate={returnDate} />}
          <p className="text-center text-sm text-gray-500">
            D-3, D-1, D-Day에 이메일 알림을 보내드립니다.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setReturnDate(null);
            }}
            className="mx-auto block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            다시 설정하기
          </button>
        </div>
      )}
    </main>
  );
}
