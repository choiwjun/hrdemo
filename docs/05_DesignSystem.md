# Design System (기초 디자인 시스템)

> **프로젝트명:** 팀메이트
> **버전:** v1.0
> **작성일:** 2025-01-28
> **스타일:** 미니멀 & 깔끔 (노션, 리니어 참고)
> **톤:** 격식 있고 정중한

---

## 1. 디자인 원칙

### 1.1 핵심 원칙

| 원칙 | 설명 | 예시 |
|------|------|------|
| **미니멀** | 필요한 요소만 표시, 불필요한 장식 제거 | 단색 배경, 깔끔한 아이콘 |
| **명확함** | 한눈에 기능과 상태 파악 가능 | 명확한 레이블, 상태 표시 |
| **일관성** | 동일한 패턴과 컴포넌트 재사용 | 동일한 버튼 스타일, 간격 |
| **접근성** | 모든 사용자가 이용 가능 | 색상 대비, 키보드 탐색 |

### 1.2 안티패턴 (하지 않을 것)

- ❌ 과도한 그라데이션, 그림자
- ❌ 복잡한 애니메이션
- ❌ 메뉴 3단계 이상 중첩
- ❌ 한 화면에 너무 많은 정보
- ❌ 이모지 과다 사용

---

## 2. 색상 팔레트

### 2.1 역할 기반 색상 체계

| 역할 | 토큰명 | 라이트 모드 | 다크 모드 | 용도 |
|------|--------|------------|----------|------|
| **Primary** | `--color-primary` | `#2563EB` | `#3B82F6` | 주요 버튼, 링크, 강조 |
| **Primary Hover** | `--color-primary-hover` | `#1D4ED8` | `#2563EB` | Primary 호버 상태 |
| **Secondary** | `--color-secondary` | `#6B7280` | `#9CA3AF` | 보조 버튼, 비활성 요소 |
| **Success** | `--color-success` | `#10B981` | `#34D399` | 성공, 완료, 출근 |
| **Warning** | `--color-warning` | `#F59E0B` | `#FBBF24` | 경고, 주의 |
| **Error** | `--color-error` | `#EF4444` | `#F87171` | 오류, 삭제, 위험 |
| **Info** | `--color-info` | `#3B82F6` | `#60A5FA` | 정보, 안내 |

### 2.2 Surface 색상 (배경)

| 역할 | 토큰명 | 라이트 모드 | 다크 모드 | 용도 |
|------|--------|------------|----------|------|
| **Background** | `--bg-primary` | `#FFFFFF` | `#111827` | 기본 배경 |
| **Surface** | `--bg-surface` | `#F9FAFB` | `#1F2937` | 카드, 패널 배경 |
| **Surface Hover** | `--bg-surface-hover` | `#F3F4F6` | `#374151` | 호버 상태 배경 |
| **Surface Active** | `--bg-surface-active` | `#E5E7EB` | `#4B5563` | 활성/선택 상태 |
| **Border** | `--border-default` | `#E5E7EB` | `#374151` | 구분선, 테두리 |
| **Border Focus** | `--border-focus` | `#2563EB` | `#3B82F6` | 포커스 링 |

### 2.3 텍스트 색상

| 역할 | 토큰명 | 라이트 모드 | 다크 모드 | 용도 |
|------|--------|------------|----------|------|
| **Text Primary** | `--text-primary` | `#111827` | `#F9FAFB` | 제목, 본문 |
| **Text Secondary** | `--text-secondary` | `#6B7280` | `#9CA3AF` | 보조 텍스트 |
| **Text Tertiary** | `--text-tertiary` | `#9CA3AF` | `#6B7280` | 플레이스홀더 |
| **Text Inverse** | `--text-inverse` | `#FFFFFF` | `#111827` | 버튼 내 텍스트 |

### 2.4 라벨 프리셋 색상

| 이름 | 색상 코드 | 용도 예시 |
|------|----------|----------|
| Red | `#EF4444` | 긴급, 중요 |
| Orange | `#F97316` | 주의 필요 |
| Yellow | `#EAB308` | 검토 중 |
| Green | `#22C55E` | 완료, 승인 |
| Blue | `#3B82F6` | 업무, 프로젝트 |
| Purple | `#8B5CF6` | 개인 |
| Pink | `#EC4899` | 기타 |
| Gray | `#6B7280` | 보류, 아카이브 |

### 2.5 접근성 체크리스트

- [x] 텍스트-배경 대비비 4.5:1 이상 (WCAG AA)
- [x] 대형 텍스트(18px+) 대비비 3:1 이상
- [x] 색상만으로 정보 전달하지 않음 (아이콘/텍스트 병행)
- [x] 포커스 링 명확히 표시

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
--font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 3.2 타이포그래피 스케일

| 토큰 | 크기 | 행간 | 굵기 | 용도 |
|------|------|------|------|------|
| `--text-xs` | 12px | 16px | 400 | 캡션, 메타 정보 |
| `--text-sm` | 14px | 20px | 400 | 보조 텍스트, 라벨 |
| `--text-base` | 16px | 24px | 400 | 본문, 기본 |
| `--text-lg` | 18px | 28px | 500 | 소제목 |
| `--text-xl` | 20px | 28px | 600 | 섹션 제목 |
| `--text-2xl` | 24px | 32px | 600 | 페이지 제목 |
| `--text-3xl` | 30px | 36px | 700 | 대시보드 숫자 |

### 3.3 타이포그래피 적용 예시

| 요소 | 스타일 | 예시 |
|------|--------|------|
| 페이지 제목 | `text-2xl`, `font-semibold` | "통합 메일함" |
| 섹션 제목 | `text-xl`, `font-semibold` | "받은 편지함" |
| 카드 제목 | `text-lg`, `font-medium` | "프로젝트 회의 안건" |
| 본문 | `text-base`, `font-normal` | 메시지 내용 |
| 메타 정보 | `text-sm`, `text-secondary` | "2시간 전 · 김철수" |
| 캡션 | `text-xs`, `text-tertiary` | "첨부파일 2개" |

---

## 4. 간격 시스템 (Spacing)

### 4.1 간격 스케일

| 토큰 | 값 | 픽셀 | 용도 |
|------|-----|------|------|
| `--space-0` | 0 | 0px | 없음 |
| `--space-1` | 0.25rem | 4px | 아이콘 간격 |
| `--space-2` | 0.5rem | 8px | 인라인 요소 간격 |
| `--space-3` | 0.75rem | 12px | 버튼 내부 패딩 |
| `--space-4` | 1rem | 16px | 기본 간격 |
| `--space-5` | 1.25rem | 20px | 카드 패딩 |
| `--space-6` | 1.5rem | 24px | 섹션 간격 |
| `--space-8` | 2rem | 32px | 대형 섹션 간격 |
| `--space-10` | 2.5rem | 40px | 페이지 여백 |
| `--space-12` | 3rem | 48px | 주요 섹션 구분 |

### 4.2 레이아웃 간격

| 용도 | 토큰 | 값 |
|------|------|-----|
| 페이지 좌우 패딩 | `--page-padding` | 24px |
| 카드 내부 패딩 | `--card-padding` | 20px |
| 리스트 아이템 간격 | `--list-gap` | 8px |
| 폼 필드 간격 | `--form-gap` | 16px |
| 사이드바 너비 | `--sidebar-width` | 240px |
| 헤더 높이 | `--header-height` | 56px |

---

## 5. 그리드 시스템

### 5.1 반응형 브레이크포인트

| 이름 | 범위 | 컬럼 | 용도 |
|------|------|------|------|
| `sm` | 640px+ | 4 | 작은 모바일 |
| `md` | 768px+ | 8 | 태블릿 |
| `lg` | 1024px+ | 12 | 작은 데스크톱 |
| `xl` | 1280px+ | 12 | 데스크톱 |
| `2xl` | 1536px+ | 12 | 큰 데스크톱 |

### 5.2 메일함 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│  Header (56px)                                           │
├────────────┬─────────────────────────────────────────────┤
│            │  Toolbar                                    │
│  Sidebar   ├─────────────────────────────────────────────┤
│  (240px)   │  Message List          │  Message Detail   │
│            │  (flex-1, min 320px)   │  (flex-1)         │
│            │                        │                    │
│            │                        │                    │
└────────────┴─────────────────────────────────────────────┘
```

---

## 6. 컴포넌트 명세

### 6.1 버튼 (Button)

#### 종류

| 종류 | 용도 | 스타일 |
|------|------|--------|
| **Primary** | 주요 액션 (저장, 전송) | 파란 배경, 흰 텍스트 |
| **Secondary** | 보조 액션 (취소) | 회색 배경, 진한 텍스트 |
| **Ghost** | 부가 액션 | 투명 배경, 호버 시 배경 |
| **Destructive** | 위험 액션 (삭제) | 빨간 배경, 흰 텍스트 |

#### 크기

| 크기 | 높이 | 패딩 | 폰트 크기 |
|------|------|------|----------|
| `sm` | 32px | 12px 16px | 14px |
| `md` | 40px | 12px 20px | 14px |
| `lg` | 48px | 16px 24px | 16px |

#### 상태

| 상태 | 스타일 변화 |
|------|------------|
| Default | 기본 스타일 |
| Hover | 배경색 10% 어둡게 |
| Active | 배경색 20% 어둡게 |
| Focus | 포커스 링 표시 (2px offset) |
| Disabled | 50% 투명도, 커서 not-allowed |
| Loading | 스피너 표시, 텍스트 유지 |

```tsx
// 버튼 사용 예시
<Button variant="primary" size="md">전송하기</Button>
<Button variant="secondary" size="md">취소</Button>
<Button variant="ghost" size="sm">더보기</Button>
<Button variant="destructive" size="md">삭제</Button>
```

---

### 6.2 입력 필드 (Input)

#### 크기

| 크기 | 높이 | 폰트 크기 |
|------|------|----------|
| `sm` | 32px | 14px |
| `md` | 40px | 14px |
| `lg` | 48px | 16px |

#### 상태

| 상태 | 스타일 |
|------|--------|
| Default | 회색 테두리 `#E5E7EB` |
| Focus | 파란 테두리 `#2563EB`, 포커스 링 |
| Error | 빨간 테두리 `#EF4444`, 오류 메시지 표시 |
| Disabled | 배경 `#F3F4F6`, 텍스트 50% 투명 |

```tsx
// 입력 필드 사용 예시
<Input
  label="이메일"
  placeholder="이메일을 입력하세요"
  error="올바른 이메일 형식이 아닙니다"
/>
```

---

### 6.3 체크박스 (Checkbox)

| 상태 | 스타일 |
|------|--------|
| Unchecked | 회색 테두리, 투명 배경 |
| Checked | 파란 배경, 흰 체크 아이콘 |
| Indeterminate | 파란 배경, 흰 대시 아이콘 |
| Disabled | 50% 투명도 |

---

### 6.4 배지 (Badge)

| 종류 | 배경색 | 텍스트 색상 | 용도 |
|------|--------|-----------|------|
| Default | `#F3F4F6` | `#374151` | 일반 상태 |
| Primary | `#DBEAFE` | `#1D4ED8` | 강조 |
| Success | `#D1FAE5` | `#065F46` | 완료, 성공 |
| Warning | `#FEF3C7` | `#92400E` | 주의 |
| Error | `#FEE2E2` | `#991B1B` | 오류, 긴급 |
| Gmail | `#FEE2E2` | `#DC2626` | Gmail 메시지 |
| Slack | `#E0E7FF` | `#4338CA` | Slack 메시지 |

```tsx
// 배지 사용 예시
<Badge variant="gmail">Gmail</Badge>
<Badge variant="slack">Slack</Badge>
<Badge variant="success">읽음</Badge>
```

---

### 6.5 카드 (Card)

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: var(--card-padding); /* 20px */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card:hover {
  background: var(--bg-surface-hover);
}
```

---

### 6.6 모달 (Modal)

| 속성 | 값 |
|------|-----|
| 오버레이 | `rgba(0, 0, 0, 0.5)` |
| 너비 (기본) | 480px |
| 너비 (대형) | 640px |
| 너비 (전체) | 90vw, max 960px |
| 둥근 모서리 | 12px |
| 패딩 | 24px |

---

### 6.7 토스트 (Toast)

| 종류 | 아이콘 | 배경색 | 지속 시간 |
|------|--------|--------|----------|
| Success | ✓ | `#10B981` | 3초 |
| Error | ✕ | `#EF4444` | 5초 |
| Warning | ⚠ | `#F59E0B` | 4초 |
| Info | ℹ | `#3B82F6` | 3초 |

---

### 6.8 메시지 리스트 아이템 (MailListItem)

```
┌────────────────────────────────────────────────────────────┐
│ □  ★  [Gmail]  김철수                    2시간 전         │
│       프로젝트 회의 안건                                  │
│       안녕하세요, 다음 주 회의 안건을 공유...  📎         │
│       [중요] [업무]                                       │
└────────────────────────────────────────────────────────────┘
```

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | 패딩 16px, 호버 시 배경색 변경 |
| 체크박스 | 16x16, 왼쪽 정렬 |
| 별표 | 16x16, 클릭 시 토글 |
| 서비스 배지 | Gmail(빨강) / Slack(보라) |
| 발신자 | `text-sm`, `font-medium` |
| 시간 | `text-xs`, `text-secondary` |
| 제목 | `text-base`, 미읽음 시 `font-semibold` |
| 미리보기 | `text-sm`, `text-secondary`, 1줄 말줄임 |
| 라벨 | 작은 배지, 가로 나열 |

---

## 7. 아이콘 시스템

### 7.1 아이콘 라이브러리

**Lucide Icons** 사용 권장 (선형, 일관된 스타일)

### 7.2 아이콘 크기

| 용도 | 크기 | 예시 |
|------|------|------|
| 인라인 텍스트 | 16px | 버튼 아이콘 |
| 기본 | 20px | 사이드바 메뉴 |
| 대형 | 24px | 페이지 아이콘 |
| 빈 상태 | 48px | 빈 상태 일러스트 |

### 7.3 핵심 아이콘 목록

| 기능 | 아이콘 | Lucide 이름 |
|------|--------|------------|
| 받은편지함 | 📥 | `inbox` |
| 보낸편지함 | 📤 | `send` |
| 임시저장 | 📝 | `file-edit` |
| 휴지통 | 🗑 | `trash-2` |
| 스팸 | ⚠️ | `alert-triangle` |
| 별표 | ⭐ | `star` |
| 라벨 | 🏷 | `tag` |
| 검색 | 🔍 | `search` |
| 설정 | ⚙️ | `settings` |
| 출근 | ▶️ | `play` |
| 퇴근 | ⏹ | `square` |
| 캘린더 | 📅 | `calendar` |
| 체크 | ✓ | `check` |
| 닫기 | ✕ | `x` |
| 메뉴 | ☰ | `menu` |

---

## 8. 애니메이션

### 8.1 기본 원칙

- 짧고 부드러운 전환 (150~300ms)
- 과도한 애니메이션 지양
- 사용자 동작에 대한 피드백 목적

### 8.2 Transition 토큰

```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

### 8.3 적용 예시

| 요소 | 애니메이션 | 지속 시간 |
|------|-----------|----------|
| 버튼 호버 | 배경색 변경 | 150ms |
| 모달 열기 | 페이드 인 + 스케일 | 200ms |
| 토스트 | 슬라이드 인 | 300ms |
| 사이드바 토글 | 너비 변경 | 200ms |
| 체크박스 | 체크 아이콘 스케일 | 150ms |

---

## 9. 시스템 메시지 (톤)

### 9.1 메시지 톤 가이드

**격식 있고 정중한 톤 사용**

| 상황 | 예시 |
|------|------|
| 성공 | "저장되었습니다", "전송이 완료되었습니다" |
| 오류 | "오류가 발생하였습니다. 다시 시도해 주십시오" |
| 확인 | "삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다" |
| 안내 | "새로운 메시지가 도착하였습니다" |
| 빈 상태 | "표시할 메시지가 없습니다" |
| 로딩 | "불러오는 중입니다..." |

### 9.2 피해야 할 표현

- ❌ "저장했어요~", "완료!" (캐주얼)
- ❌ "앗, 오류가 발생했어요 😢" (이모지)
- ❌ "잠시만요~" (비격식)

---

## 10. 접근성 체크리스트

### 10.1 색상

- [x] 텍스트 대비비 4.5:1 이상
- [x] 색상만으로 상태 구분하지 않음
- [x] 포커스 상태 명확히 표시

### 10.2 키보드 탐색

- [x] 모든 인터랙티브 요소 Tab으로 접근 가능
- [x] Enter/Space로 활성화 가능
- [x] Escape로 모달/드롭다운 닫기
- [x] 포커스 트랩 (모달 내)

### 10.3 스크린 리더

- [x] 모든 이미지에 alt 텍스트
- [x] 버튼에 명확한 레이블
- [x] 랜드마크 역할 지정 (header, main, nav)
- [x] 동적 컨텐츠 aria-live 적용

---

## 부록: Tailwind CSS 설정

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          50: '#EFF6FF',
          100: '#DBEAFE',
          // ...
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      spacing: {
        'sidebar': '240px',
        'header': '56px',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
    },
  },
};
```
