# 📚 반납일 리마인더 (MVP)

책 반납일을 시각적으로 보여주는 간단한 웹앱입니다.

## 기능

- **입력**: (선택) 이메일, 대출일, 대출 기간(7/14/21/30일)
- **자동 계산**: 반납일, 남은 일수
- **D-Day 표시**: D-N / D-Day / 연체 N일 (색상 구분)
  - 이메일 알림 기능은 현재 MVP에서 제외되었습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

## Vercel 배포

1. 저장소 연결 후 Vercel에 배포
2. 별도의 환경 변수 없이 바로 동작합니다.

## 주요 파일

- `app/page.tsx` — 메인 폼 및 D-Day 표시
- `lib/dateUtils.ts` — 날짜 계산
- `components/DdayDisplay.tsx` — D-Day 시각화
