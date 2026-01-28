# TRD (기술 요구사항 정의서)

> **프로젝트명:** 팀메이트
> **버전:** v1.0
> **작성일:** 2025-01-28
> **상태:** 기술 스택 확정

---

## 1. 시스템 아키텍처

### 1.1 전체 구조도

```
┌─────────────────────────────────────────────────────────────────┐
│                         사용자 (브라우저)                          │
│                    PC / 모바일 반응형 웹                           │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel (호스팅/CDN)                        │
│                     - 자동 배포 (Git 연동)                         │
│                     - Edge 캐싱                                   │
│                     - SSL 인증서 자동 관리                         │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 애플리케이션                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Pages     │  │ Components  │  │    Hooks    │              │
│  │  (라우팅)   │  │   (UI)      │  │  (로직)     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Stores    │  │   Utils     │  │   Types     │              │
│  │  (상태관리) │  │  (유틸리티) │  │  (타입)     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase (BaaS)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Auth       │  │  Database   │  │  Storage    │              │
│  │  (인증)     │  │ (PostgreSQL)│  │  (파일)     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │  Realtime   │  │  Edge Func  │  ← Phase 4 이후               │
│  │  (실시간)   │  │  (서버리스) │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ (Phase 4 이후)
┌─────────────────────────────────────────────────────────────────┐
│                      외부 서비스 연동                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Gmail API  │  │  Slack API  │  │  OpenAI API │              │
│  │  (이메일)   │  │  (메시지)   │  │  (AI 요약)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 MVP 단계 아키텍처 (Phase 1)

```
사용자 ──▶ Vercel ──▶ Next.js ──▶ Supabase (DB + Auth)
                          │
                          └──▶ Mock 데이터 (JSON)
```

- 외부 API 연동 없이 Mock 데이터로 UI/UX 검증
- Supabase는 인증 및 사용자 데이터만 관리
- 메일/메시지 데이터는 로컬 Mock JSON 사용

---

## 2. 권장 기술 스택

### 2.1 프론트엔드

| 항목 | 선택 | 이유 |
|------|------|------|
| **프레임워크** | Next.js 14+ (App Router) | React 기반, SSR/SSG 지원, Vercel 최적화 |
| **언어** | TypeScript | 타입 안정성, IDE 자동완성, 버그 예방 |
| **스타일링** | Tailwind CSS | 유틸리티 기반, 빠른 개발, 일관된 디자인 |
| **UI 컴포넌트** | shadcn/ui | 접근성 내장, 커스터마이징 용이, Tailwind 호환 |
| **상태관리** | Zustand | 간단한 API, 보일러플레이트 최소 |
| **데이터 페칭** | TanStack Query (react-query) | 캐싱, 동기화, 로딩 상태 관리 |
| **폼 관리** | React Hook Form + Zod | 성능 최적화, 타입 안전 검증 |

#### 대안 및 벤더 락인 리스크

| 선택 | 대안 | 락인 리스크 |
|------|------|------------|
| Next.js | Remix, Vite+React | 낮음 (React 생태계 공유) |
| Tailwind CSS | CSS Modules, styled-components | 낮음 (CSS 표준 기반) |
| shadcn/ui | Radix UI, Chakra UI | 낮음 (복사 방식, 의존성 없음) |
| Zustand | Jotai, Redux Toolkit | 낮음 (표준 React 패턴) |

### 2.2 백엔드

| 항목 | 선택 | 이유 |
|------|------|------|
| **플랫폼** | Supabase | Auth+DB+Storage 통합, 무료 티어 제공 |
| **데이터베이스** | PostgreSQL (Supabase 내장) | 관계형 DB, 확장성, 표준 SQL |
| **인증** | Supabase Auth | 이메일/소셜 로그인, 세션 관리 내장 |
| **파일 저장** | Supabase Storage | S3 호환, 이미지/첨부파일 관리 |
| **서버리스 함수** | Supabase Edge Functions | 필요 시 서버 로직 추가 (Phase 4+) |

#### 대안 및 벤더 락인 리스크

| 선택 | 대안 | 락인 리스크 |
|------|------|------------|
| Supabase | Firebase, PlanetScale+Auth0 | 중간 (PostgreSQL은 이식 가능) |
| PostgreSQL | MySQL, MongoDB | 낮음 (표준 SQL) |

### 2.3 배포/호스팅

| 항목 | 선택 | 이유 |
|------|------|------|
| **호스팅** | Vercel | Next.js 공식 지원, 자동 배포, CDN |
| **도메인** | Vercel 기본 도메인 (MVP) | 무료, 빠른 시작 |
| **CI/CD** | Vercel Git 통합 | Push → 자동 배포 |

#### 예상 비용 (MVP 단계)

| 서비스 | 플랜 | 월 비용 |
|--------|------|--------|
| Vercel | Hobby (무료) | $0 |
| Supabase | Free 티어 | $0 |
| 도메인 | 기본 제공 | $0 |
| **합계** | | **$0/월** |

#### 확장 시 비용 예측

| 단계 | 사용자 규모 | 예상 비용 |
|------|-----------|----------|
| MVP | ~50명 | $0 |
| Phase 2 | ~200명 | $25~50/월 |
| Phase 3 | ~500명 | $50~100/월 |

### 2.4 외부 API/서비스 (Phase 4 이후)

| 서비스 | 용도 | 대체 옵션 |
|--------|------|----------|
| Gmail API | 이메일 송수신 | Microsoft Graph API |
| Slack API | 메시지 동기화 | Discord API, Teams API |
| OpenAI API | 메일 요약/분류 | Claude API, Gemini API |
| Google Calendar API | 일정 동기화 | CalDAV |

---

## 3. 비기능적 요구사항

### 3.1 성능

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 초기 로딩 (LCP) | < 2.5초 | Lighthouse |
| 인터랙션 반응 (FID) | < 100ms | Lighthouse |
| 레이아웃 안정성 (CLS) | < 0.1 | Lighthouse |
| API 응답 시간 | < 500ms | Supabase 대시보드 |
| 메시지 목록 로딩 | < 1초 | 자체 측정 |

### 3.2 보안

| 항목 | 요구사항 |
|------|----------|
| 통신 | HTTPS 필수 (Vercel 자동 제공) |
| 인증 | Supabase Auth (JWT 기반) |
| 세션 | HttpOnly 쿠키, 만료 시간 설정 |
| 비밀번호 | 최소 8자, 해시 저장 (Supabase 자동) |
| API 키 | 환경 변수로 관리, 클라이언트 노출 금지 |
| RLS | Supabase Row Level Security 적용 |

### 3.3 확장성

| 단계 | 전략 |
|------|------|
| MVP (~50명) | Supabase Free 티어 |
| 성장기 (~500명) | Supabase Pro 업그레이드 |
| 확장기 (1000명+) | 읽기 복제본, 캐싱 레이어 추가 |

### 3.4 가용성

| 항목 | 목표 |
|------|------|
| 가동률 | 99.5% (Vercel/Supabase SLA) |
| 백업 | Supabase 자동 백업 (일 1회) |
| 복구 | Point-in-time 복구 지원 (Pro) |

---

## 4. 데이터베이스 요구사항

### 4.1 스키마 설계 원칙

1. **정규화 우선**: 중복 데이터 최소화
2. **명확한 관계**: 외래 키로 참조 무결성 보장
3. **Soft Delete**: 삭제 시 deleted_at 컬럼 사용
4. **타임스탬프**: 모든 테이블에 created_at, updated_at 필수
5. **UUID**: 기본 키로 UUID 사용 (보안, 분산 환경 대비)

### 4.2 인덱싱 전략

| 테이블 | 인덱스 대상 | 이유 |
|--------|-----------|------|
| messages | user_id, created_at | 사용자별 최신순 조회 |
| messages | is_read | 안읽은 메시지 필터링 |
| messages | label_ids (GIN) | 라벨별 필터링 |
| attendances | user_id, date | 사용자별 일자 조회 |
| events | start_date, end_date | 기간별 일정 조회 |

### 4.3 주요 테이블 개요

```
users          - 사용자 정보
profiles       - 사용자 프로필 (확장 정보)
messages       - 통합 메시지 (Gmail + Slack)
labels         - 사용자 정의 라벨
attendances    - 출퇴근 기록
events         - 일정/이벤트
event_participants - 일정 참석자
```

---

## 5. 접근 제어 및 권한 모델

### 5.1 역할 정의

| 역할 | 설명 | 권한 |
|------|------|------|
| **member** | 일반 팀원 | 본인 데이터 CRUD, 팀 데이터 조회 |
| **manager** | 팀장/관리자 | 팀원 근태 조회, 팀 설정 관리 |
| **admin** | 시스템 관리자 | 전체 사용자/설정 관리 |

### 5.2 권한 정책 (RLS)

```sql
-- 예시: 사용자는 본인 메시지만 조회 가능
CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
USING (auth.uid() = user_id);

-- 예시: 매니저는 팀원 근태 조회 가능
CREATE POLICY "Managers can view team attendance"
ON attendances FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.manager_id = auth.uid()
    AND team_members.member_id = attendances.user_id
  )
);
```

### 5.3 MVP 권한 (단순화)

MVP 단계에서는 단일 팀 가정:
- 모든 사용자: member 역할
- 인증된 사용자만 접근 가능
- 본인 데이터만 CRUD 가능

---

## 6. 데이터 생명주기

### 6.1 수집 원칙

| 원칙 | 내용 |
|------|------|
| 최소 수집 | 서비스에 필수적인 정보만 수집 |
| 명시적 동의 | 수집 목적 명시, 동의 후 수집 |
| 목적 제한 | 수집 목적 외 사용 금지 |

### 6.2 데이터 분류

| 분류 | 예시 | 보존 기간 |
|------|------|----------|
| 계정 정보 | 이메일, 이름 | 탈퇴 후 30일 |
| 근태 기록 | 출퇴근 시간 | 3년 (법적 요건) |
| 메시지 | Mock 데이터 | 세션 종료 시 |
| 로그 | 접근 기록 | 90일 |

### 6.3 삭제/익명화 경로

```
사용자 탈퇴 요청
    │
    ▼
계정 비활성화 (30일 유예)
    │
    ▼
개인 식별 정보 익명화
    │
    ▼
비식별 데이터만 보존 (통계용)
```

---

## 7. 폴더 구조 (권장)

```
teammate/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 인증 관련 라우트
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # 인증 필요 라우트
│   │   │   ├── mail/           # 통합 메일함 (FEAT-1)
│   │   │   ├── attendance/     # 근태 관리 (FEAT-2)
│   │   │   ├── calendar/       # 팀 캘린더 (FEAT-3)
│   │   │   └── settings/       # 설정
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── mail/               # 메일 관련 컴포넌트
│   │   │   ├── MailSidebar.tsx
│   │   │   ├── MailList.tsx
│   │   │   ├── MailItem.tsx
│   │   │   ├── MailDetail.tsx
│   │   │   └── ComposeModal.tsx
│   │   ├── attendance/         # 근태 관련 컴포넌트
│   │   └── calendar/           # 캘린더 관련 컴포넌트
│   │
│   ├── hooks/                  # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useMessages.ts
│   │   └── useAttendance.ts
│   │
│   ├── stores/                 # Zustand 스토어
│   │   ├── authStore.ts
│   │   └── mailStore.ts
│   │
│   ├── lib/                    # 유틸리티
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   └── utils.ts
│   │
│   ├── types/                  # TypeScript 타입
│   │   ├── database.ts
│   │   ├── mail.ts
│   │   └── attendance.ts
│   │
│   └── mocks/                  # Mock 데이터
│       ├── messages.json
│       ├── labels.json
│       └── users.json
│
├── public/                     # 정적 파일
├── .env.local                  # 환경 변수 (gitignore)
├── .env.example                # 환경 변수 템플릿
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 8. 환경 변수

### 8.1 필수 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 8.2 Phase 4 이후 추가

```env
# Gmail API
GMAIL_CLIENT_ID=xxxxx
GMAIL_CLIENT_SECRET=xxxxx

# Slack API
SLACK_CLIENT_ID=xxxxx
SLACK_CLIENT_SECRET=xxxxx
SLACK_SIGNING_SECRET=xxxxx

# OpenAI (Phase 5)
OPENAI_API_KEY=sk-xxxxx
```

---

## 부록: 기술 결정 로그

| 결정 | 선택 | 고려한 대안 | 선택 근거 |
|------|------|-----------|----------|
| 프론트엔드 | Next.js | Remix, Vite | Vercel 최적화, 풍부한 자료 |
| 스타일링 | Tailwind | CSS Modules | 빠른 개발, AI 도구 호환성 |
| 백엔드 | Supabase | Firebase | PostgreSQL, RLS, 무료 티어 |
| 상태관리 | Zustand | Redux | 간단한 API, 작은 번들 |
| 배포 | Vercel | Netlify | Next.js 공식 지원 |
