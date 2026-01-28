# Coding Convention & AI Collaboration Guide
# 코딩 컨벤션 및 AI 협업 가이드

> **프로젝트명:** 팀메이트
> **버전:** v1.0
> **작성일:** 2025-01-28
> **목적:** AI 코딩 파트너가 고품질, 유지보수 가능, 안전한 코드를 일관되게 생성하도록 지원

---

## 1. 핵심 원칙

### 1.1 "신뢰하되, 검증하라" (Trust, but Verify)

AI가 생성한 코드는 유용하지만, 항상 다음을 확인하세요:

| 체크 항목 | 확인 방법 |
|----------|----------|
| 문법 오류 | 빌드/린트 통과 여부 |
| 로직 정확성 | 수동 테스트, 단위 테스트 |
| 보안 취약점 | 보안 체크리스트 검토 |
| 성능 | 브라우저 DevTools, Lighthouse |
| 접근성 | axe DevTools |

### 1.2 점진적 개발

```
작은 단위로 개발 → 테스트 → 확인 → 다음 단계
```

- 한 번에 너무 많은 코드를 생성하지 마세요
- 각 단계마다 동작 확인
- 문제 발생 시 이전 상태로 쉽게 롤백 가능

### 1.3 일관성 우선

- 기존 코드베이스의 패턴을 따르세요
- 새로운 패턴 도입 시 문서화하세요
- 같은 문제는 같은 방식으로 해결하세요

---

## 2. 프로젝트 설정 및 기술 스택

### 2.1 기술 스택 버전

| 기술 | 권장 버전 | 비고 |
|------|----------|------|
| Node.js | 20.x LTS | `.nvmrc` 파일로 관리 |
| Next.js | 14.x | App Router 사용 |
| React | 18.x | Next.js와 함께 설치 |
| TypeScript | 5.x | strict 모드 |
| Tailwind CSS | 3.x | |
| Supabase | latest | |

### 2.2 버전 관리 원칙

```json
// package.json
{
  "dependencies": {
    // 정확한 버전 (^, ~ 사용 주의)
    "next": "14.1.0",
    "@supabase/supabase-js": "2.39.0"
  }
}
```

- 주요 의존성은 가능하면 정확한 버전 명시
- `package-lock.json` 커밋 필수
- 정기적 의존성 업데이트 (보안 패치)

### 2.3 환경 변수 관리

```bash
# .env.local (로컬 개발용, gitignore)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# .env.example (템플릿, 커밋)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**규칙:**
- 실제 값은 절대 커밋하지 않음
- `NEXT_PUBLIC_` 접두사: 클라이언트 노출 가능
- 민감한 키는 서버 환경 변수로만 사용

---

## 3. 아키텍처 및 모듈성

### 3.1 폴더 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/             # 인증 그룹 (로그인, 회원가입)
│   ├── (dashboard)/        # 인증 필요 그룹
│   └── layout.tsx          # 루트 레이아웃
│
├── components/             # React 컴포넌트
│   ├── ui/                 # 범용 UI (버튼, 입력 등)
│   ├── layout/             # 레이아웃 (헤더, 사이드바)
│   ├── mail/               # 메일 기능 컴포넌트
│   ├── attendance/         # 근태 기능 컴포넌트
│   └── calendar/           # 캘린더 기능 컴포넌트
│
├── hooks/                  # 커스텀 훅
├── stores/                 # Zustand 스토어
├── lib/                    # 유틸리티, 설정
├── types/                  # TypeScript 타입
└── mocks/                  # Mock 데이터
```

### 3.2 컴포넌트 분리 원칙

**크기 기준:**
- 파일당 최대 200줄 권장
- 200줄 초과 시 분리 고려

**분리 방법:**
```
MailList.tsx (200줄 초과)
    ↓
MailList.tsx (리스트 컨테이너)
MailListItem.tsx (개별 아이템)
MailListToolbar.tsx (툴바)
useMailList.ts (로직 훅)
```

**컴포넌트 종류:**

| 종류 | 역할 | 예시 |
|------|------|------|
| Page | 라우트 엔트리포인트 | `app/mail/page.tsx` |
| Container | 상태/로직 관리 | `MailContainer.tsx` |
| Presenter | UI 렌더링 | `MailList.tsx` |
| UI | 범용 재사용 | `Button.tsx` |

### 3.3 import 순서

```typescript
// 1. React/Next
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. 내부 절대 경로 (@/)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/types/mail';

// 4. 상대 경로 (같은 폴더)
import { MailListItem } from './MailListItem';
```

---

## 4. AI 소통 원칙 (프롬프트 엔지니어링)

### 4.1 효과적인 지시 방법

**좋은 예:**
```
MailListItem 컴포넌트를 구현해주세요.

요구사항:
- Database Design의 Message 타입 사용
- Design System 6.8의 레이아웃 따르기
- 체크박스, 별표, 서비스 배지, 발신자, 시간, 제목, 미리보기 포함
- 미읽음 메시지는 굵은 글씨

참조:
- types/mail.ts의 Message 타입
- Design System > 6.8 메시지 리스트 아이템
```

**나쁜 예:**
```
메일 아이템 만들어줘
```

### 4.2 컨텍스트 제공

AI에게 항상 충분한 컨텍스트를 제공하세요:

| 제공 정보 | 예시 |
|----------|------|
| 어떤 문서 참조 | "PRD의 US-1.1 참조" |
| 기존 코드 위치 | "hooks/useMessages.ts와 유사하게" |
| 기대 결과물 | "TypeScript 타입 포함" |
| 제약 조건 | "shadcn/ui Button 사용" |

### 4.3 단계별 요청

복잡한 작업은 단계로 나누세요:

```
1단계: Message 타입 정의해주세요
2단계: useMessages 훅 구현해주세요
3단계: MailList 컴포넌트 구현해주세요
4단계: 페이지에 통합해주세요
```

### 4.4 피드백 루프

```
AI 코드 생성 → 검토 → 문제 발견 → 구체적 피드백 → 수정 요청
```

**구체적 피드백 예:**
```
위 코드에서 다음을 수정해주세요:
1. Button import를 @/components/ui/button에서 가져오기
2. 에러 상태에서 재시도 버튼 추가
3. 로딩 중 스켈레톤 UI 표시
```

---

## 5. 코드 스타일 가이드

### 5.1 네이밍 컨벤션

| 대상 | 스타일 | 예시 |
|------|--------|------|
| 컴포넌트 | PascalCase | `MailListItem` |
| 훅 | camelCase + use 접두사 | `useMessages` |
| 함수 | camelCase | `formatDate` |
| 상수 | SCREAMING_SNAKE_CASE | `MAX_PAGE_SIZE` |
| 타입/인터페이스 | PascalCase | `Message`, `UserProfile` |
| 파일 (컴포넌트) | PascalCase | `MailListItem.tsx` |
| 파일 (훅/유틸) | camelCase | `useMessages.ts` |
| 폴더 | kebab-case | `mail-list` |
| CSS 클래스 | kebab-case | `mail-list-item` |

### 5.2 TypeScript 규칙

```typescript
// ✅ 좋은 예: 명시적 타입
interface MailListItemProps {
  message: Message;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

// ✅ 좋은 예: 타입 추론 활용
const [isOpen, setIsOpen] = useState(false); // boolean 추론

// ❌ 나쁜 예: any 사용
const handleClick = (e: any) => { ... }

// ✅ 좋은 예: 적절한 타입
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }
```

**규칙:**
- `any` 사용 금지 (불가피한 경우 `unknown` 사용)
- `as` 타입 단언 최소화
- 함수 파라미터와 반환 타입 명시 (복잡한 경우)
- `interface` 우선 (확장 가능), 유니온은 `type` 사용

### 5.3 React 컴포넌트 패턴

```tsx
// 컴포넌트 파일 구조
import { useState } from 'react';

// 타입 정의
interface MailListItemProps {
  message: Message;
  onSelect: (id: string) => void;
}

// 메인 컴포넌트
export function MailListItem({ message, onSelect }: MailListItemProps) {
  // 1. 훅
  const [isHovered, setIsHovered] = useState(false);

  // 2. 이벤트 핸들러
  const handleClick = () => {
    onSelect(message.id);
  };

  // 3. 조건부 렌더링 로직
  const formattedDate = formatDate(message.received_at);

  // 4. 렌더링
  return (
    <div onClick={handleClick}>
      {/* ... */}
    </div>
  );
}
```

### 5.4 Tailwind CSS 가이드

```tsx
// ✅ 좋은 예: 그룹화된 클래스
<div className="
  flex items-center gap-4
  p-4
  bg-surface hover:bg-surface-hover
  border border-default rounded-lg
  transition-colors
">

// ❌ 나쁜 예: 정리되지 않은 클래스
<div className="p-4 flex border hover:bg-surface-hover bg-surface gap-4 items-center rounded-lg border-default transition-colors">
```

**클래스 순서:**
1. 레이아웃 (flex, grid, position)
2. 크기 (w, h, p, m)
3. 배경/테두리
4. 텍스트
5. 효과 (shadow, transition)

**긴 클래스는 변수로:**
```tsx
const buttonBaseClass = "px-4 py-2 rounded-lg font-medium transition-colors";
const buttonPrimaryClass = `${buttonBaseClass} bg-primary text-white hover:bg-primary-hover`;
```

---

## 6. 코드 품질 및 보안

### 6.1 보안 체크리스트

**인증/인가:**
- [ ] 모든 API 요청에 인증 토큰 포함
- [ ] 민감한 작업 전 권한 확인
- [ ] 세션 만료 처리

**입력 검증:**
- [ ] 사용자 입력 서버에서 재검증
- [ ] SQL 인젝션 방지 (Supabase RLS 사용)
- [ ] XSS 방지 (사용자 입력 HTML 이스케이프)

**데이터 보호:**
- [ ] 민감 정보 클라이언트 노출 금지
- [ ] HTTPS 통신만 사용
- [ ] 비밀번호 평문 저장 금지

### 6.2 XSS 방지

```tsx
// ❌ 위험: dangerouslySetInnerHTML 무분별 사용
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 안전: DOMPurify로 sanitize
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />

// ✅ 가장 안전: 텍스트로만 렌더링
<div>{userInput}</div>
```

### 6.3 환경 변수 보안

```typescript
// ❌ 위험: 민감한 키를 클라이언트에 노출
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// NEXT_PUBLIC_ 없으면 서버에서만 접근 가능

// ✅ 안전: 클라이언트용 키만 노출
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

### 6.4 에러 처리

```typescript
// ✅ 좋은 예: 사용자 친화적 에러 메시지
try {
  await supabase.auth.signIn(credentials);
} catch (error) {
  // 로그에는 상세 정보
  console.error('Login failed:', error);

  // 사용자에게는 일반 메시지
  toast.error('로그인에 실패하였습니다. 다시 시도해 주십시오.');
}

// ❌ 나쁜 예: 에러 객체 그대로 노출
catch (error) {
  toast.error(error.message); // 내부 정보 노출 위험
}
```

---

## 7. 테스트 및 디버깅

### 7.1 테스트 전략

| 테스트 종류 | 도구 | 대상 |
|------------|------|------|
| 단위 테스트 | Jest + RTL | 훅, 유틸, 컴포넌트 |
| 통합 테스트 | Jest + RTL | 컴포넌트 조합 |
| E2E 테스트 | Playwright | 사용자 플로우 |

### 7.2 테스트 파일 위치

```
src/
├── hooks/
│   ├── useMessages.ts
│   └── __tests__/
│       └── useMessages.test.ts
│
├── components/
│   └── mail/
│       ├── MailList.tsx
│       └── __tests__/
│           └── MailList.test.tsx
```

### 7.3 테스트 작성 예시

```typescript
// hooks/__tests__/useMessages.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useMessages } from '../useMessages';

describe('useMessages', () => {
  it('should fetch messages successfully', async () => {
    const { result } = renderHook(() => useMessages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.messages).toHaveLength(20);
  });

  it('should filter by service', async () => {
    const { result } = renderHook(() =>
      useMessages({ service: 'gmail' })
    );

    await waitFor(() => {
      expect(result.current.messages.every(m => m.service === 'gmail')).toBe(true);
    });
  });
});
```

### 7.4 디버깅 워크플로우

```
1. 문제 재현
   └─ 동일 조건에서 반복 발생 확인

2. 범위 좁히기
   └─ console.log 또는 React DevTools로 상태 확인
   └─ 네트워크 탭에서 API 응답 확인

3. 가설 검증
   └─ 예상 원인 하나씩 테스트
   └─ 최소 재현 케이스 만들기

4. 수정 및 확인
   └─ 수정 후 원래 문제 해결 확인
   └─ 사이드 이펙트 없는지 확인
```

---

## 8. Git 워크플로우

### 8.1 브랜치 전략

```
main (프로덕션)
 └── develop (개발 통합)
      ├── feature/mail-list
      ├── feature/attendance
      └── fix/login-error
```

**브랜치 네이밍:**
- `feature/기능명` - 새 기능
- `fix/이슈명` - 버그 수정
- `refactor/대상` - 리팩토링
- `docs/문서명` - 문서 수정

### 8.2 커밋 메시지

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 (동작 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 등

**예시:**
```
feat(mail): 메시지 검색 기능 구현

- 키워드 검색 (제목, 본문, 발신자)
- 디바운싱 300ms 적용
- 검색 결과 하이라이트

Closes #123
```

### 8.3 Pull Request 가이드

```markdown
## 변경 사항
- 메시지 검색 기능 추가
- 검색 결과 하이라이트 표시

## 테스트 방법
1. 메일함 페이지 접속
2. 검색창에 키워드 입력
3. 결과 확인

## 체크리스트
- [x] 빌드 통과
- [x] 린트 통과
- [x] 테스트 통과
- [ ] 문서 업데이트 (해당 없음)

## 스크린샷
(필요시 첨부)
```

---

## 9. 성능 최적화 가이드

### 9.1 React 최적화

```tsx
// 1. 불필요한 리렌더링 방지
const MemoizedComponent = React.memo(ExpensiveComponent);

// 2. 콜백 메모이제이션
const handleClick = useCallback(() => {
  // ...
}, [dependency]);

// 3. 계산 결과 메모이제이션
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 4. 리스트 가상화 (긴 목록)
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 9.2 번들 최적화

```typescript
// 동적 import로 코드 분할
const MailDetail = dynamic(() => import('./MailDetail'), {
  loading: () => <Skeleton />,
});

// 조건부 로딩
{showDetail && <MailDetail message={selected} />}
```

### 9.3 이미지 최적화

```tsx
// Next.js Image 컴포넌트 사용
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="프로필"
  width={40}
  height={40}
  priority // 중요 이미지는 우선 로딩
/>
```

---

## 10. AI 협업 베스트 프랙티스

### 10.1 세션 시작 시

```
안녕하세요. 팀메이트 프로젝트 작업을 시작합니다.

현재 상태:
- M3-2 메시지 목록 조회 완료
- M3-3 검색 기능 작업 시작

오늘 목표:
- M3-3 검색 기능 완료
- M3-4 읽음/안읽음 토글 시작

참조 문서:
- PRD US-1.3
- User Flow 3.1 검색 분기
```

### 10.2 작업 중

```
검색 기능 구현 중 질문입니다.

현재 상황:
- 검색 입력 필드 구현 완료
- 디바운싱 적용 완료

문제:
- 검색 결과가 없을 때 UI가 없습니다

요청:
- 빈 검색 결과 UI 컴포넌트를 구현해주세요
- Design System의 빈 상태 패턴 참고
```

### 10.3 코드 리뷰 요청

```
다음 코드를 리뷰해주세요.

파일: hooks/useSearch.ts

확인 포인트:
1. 타입이 올바른가?
2. 에러 처리가 충분한가?
3. 성능 이슈가 있는가?

[코드 붙여넣기]
```

### 10.4 트러블슈팅 요청

```
오류가 발생했습니다.

증상:
- 검색 시 무한 루프 발생

에러 메시지:
[에러 메시지 붙여넣기]

관련 코드:
[코드 붙여넣기]

시도한 것:
1. useEffect 의존성 배열 확인
2. 디바운싱 확인

도움이 필요합니다.
```

---

## 부록: 빠른 참조

### 자주 사용하는 명령어

```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint

# 타입 검사
npm run type-check

# 테스트 실행
npm test

# E2E 테스트
npm run test:e2e
```

### 자주 참조하는 문서 링크

| 문서 | 용도 |
|------|------|
| 01_PRD.md | 기능 요구사항 |
| 02_TRD.md | 기술 스택, 아키텍처 |
| 03_UserFlow.md | 화면 흐름 |
| 04_DatabaseDesign.md | DB 스키마 |
| 05_DesignSystem.md | UI 스타일 |
| 06_TASKS.md | 개발 태스크 |

### 긴급 체크리스트

**배포 전:**
- [ ] 빌드 성공
- [ ] 환경 변수 설정
- [ ] 테스트 통과
- [ ] 보안 검토

**버그 발생 시:**
- [ ] 재현 방법 확인
- [ ] 콘솔 오류 확인
- [ ] 네트워크 요청 확인
- [ ] 관련 코드 로그 추가
