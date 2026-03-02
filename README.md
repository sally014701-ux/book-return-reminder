# 📚 반납일 리마인더 (MVP)

책 반납일을 시각화하고, D-3 / D-1 / D-Day에 이메일 알림을 보내는 웹앱입니다.

## 기능

- **입력**: 이메일, 대출일, 대출 기간(7/14/21/30일)
- **자동 계산**: 반납일, 남은 일수
- **D-Day 표시**: D-N / D-Day / 연체 N일 (색상 구분)
- **이메일 알림**: D-3, D-1, D-Day에 자동 발송 (Resend)

## 실행 방법

```bash
npm install
cp .env.example .env
# .env에 RESEND_API_KEY 입력
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `RESEND_API_KEY` | ✅ | [Resend](https://resend.com/api-keys) API 키 |
| `RESEND_FROM_EMAIL` | | 발신 주소 (미설정 시 Resend 기본 도메인) |
| `CRON_SECRET` | | Cron API 호출 시 Bearer 토큰 (Vercel Cron 권장) |

## Vercel 배포

1. 저장소 연결 후 Vercel에 배포
2. 프로젝트 설정에서 `RESEND_API_KEY` (필수), `CRON_SECRET`(권장) 추가
3. Cron은 `vercel.json`에 따라 매일 **00:00 UTC**에 `/api/cron/send-reminders` 호출 (한국 시간 09:00)

## 저장소 (MVP)

리마인더는 **메모리**에만 저장됩니다. 서버 재시작/배포 시 초기화되며, Vercel 서버리스에서는 인스턴스마다 데이터가 갈라집니다. 실제 운영 시에는 DB 또는 Vercel KV 등 영구 저장소로 교체하는 것을 권장합니다.

## 예상 파일 구조

- `app/page.tsx` — 메인 폼 및 D-Day 표시
- `app/api/reminder/route.ts` — 리마인더 저장 API
- `app/api/cron/send-reminders/route.ts` — D-3 / D-1 / D-0 이메일 발송
- `lib/email.ts` — Resend 이메일 발송
- `lib/dateUtils.ts` — 날짜 계산
- `lib/store.ts` — 인메모리 저장소
- `components/DdayDisplay.tsx` — D-Day 시각화
