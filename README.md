# 팀메이트 (TeamMate)

소규모 팀을 위한 경량 그룹웨어 애플리케이션입니다.

## 주요 기능

- **통합 메일함**: Gmail과 Slack 메시지를 한 곳에서 관리
- **근태 관리**: 출퇴근 기록 및 주간/월간 근태 현황 조회
- **팀 캘린더**: 일정 관리 및 참석자 초대
- **대시보드**: 오늘의 일정, 미읽은 메시지, 근태 현황 한눈에 보기

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State Management**: Zustand, TanStack Query
- **Form**: React Hook Form + Zod
- **Database**: Supabase (Mock 데이터 사용 중)

## 시작하기

### 필수 조건

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 필요한 값을 설정하세요:

```bash
cp .env.example .env.local
```

## 스크립트

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm start

# 린트
npm run lint

# 단위 테스트
npm test

# 테스트 커버리지
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지
│   └── (dashboard)/       # 대시보드 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 기본 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── mail/             # 메일 관련 컴포넌트
│   └── calendar/         # 캘린더 관련 컴포넌트
├── hooks/                 # Custom React Hooks
├── stores/               # Zustand 스토어
├── types/                # TypeScript 타입 정의
├── lib/                  # 유틸리티 및 설정
└── mocks/                # Mock 데이터
```

## Vercel 배포

### 자동 배포

1. GitHub 저장소를 Vercel에 연결
2. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. main 브랜치에 push하면 자동 배포

### 수동 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

## 라이선스

MIT License
