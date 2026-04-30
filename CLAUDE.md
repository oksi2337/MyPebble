# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # 최초 의존성 설치
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## Architecture

React 18 + Vite 앱. 외부 상태관리 라이브러리 없음. 스타일은 CSS Modules.

```
src/
├── App.jsx               # 루트: 탭 상태, todos 상태, CRUD 핸들러
├── App.css               # 전역 리셋, CSS 변수, .app-container/.app-shell
├── hooks/
│   └── useLocalStorage.js  # localStorage 래핑 커스텀 훅
├── utils/
│   └── sortTodos.js        # sortTodos(), calcDday() 유틸
└── components/
    ├── Header.jsx          # 앱 타이틀 + 오늘 날짜
    ├── TabBar.jsx          # 개인/업무 탭 전환 (role="tablist")
    ├── TodoList.jsx        # 미완료/완료 분리 렌더링, 탭 전환 시 key로 fadeIn
    ├── TodoItem.jsx        # 카드 UI: 체크박스, 인라인 편집, 날짜 편집, 삭제
    ├── AddTodoBar.jsx      # 하단 고정 입력창 + 날짜 토글 슬라이드
    └── DdayBadge.jsx       # D-day 뱃지 (today/urgent/overdue/normal)
```

## Todo 객체 스키마

```js
{
  id: string,           // `${Date.now()}-${random}` 형식
  text: string,
  startDate: string | null,  // "YYYY-MM-DD" (input[type="date"] 값 그대로)
  deadline: string | null,   // "YYYY-MM-DD"
  completed: boolean,
  createdAt: string,    // ISO 8601
  completedAt: string | null // ISO 8601
}
```

날짜는 `"YYYY-MM-DD"` 문자열로 저장. `new Date(dateStr)`은 UTC 파싱 문제가 있으므로 `calcDday()`에서는 `split('-')`로 수동 파싱.

## Key Design Decisions

**테마 컬러**: `App.css`에서 `.app-container[data-tab="personal"|"work"]`로 CSS 변수(`--tab-primary`, `--tab-light`, `--tab-lighter`, `--tab-dark`)를 전환. 하위 컴포넌트는 이 변수만 참조.

**정렬 우선순위**: `sortTodos()` — 마감일 있음(오름차순) → 시작일만 있음(오름차순) → 날짜 없음(생성순) → 완료(최근완료 상단).

**완료 애니메이션**: TodoItem에서 `.completing` 클래스로 즉시 시각 피드백 → 380ms 후 실제 `onToggle` 호출 → 정렬 재계산으로 완료 섹션 하단 이동.

**신규 항목 슬라이드인**: `addTodo`에서 `recentlyAddedId`를 700ms 동안 유지. TodoList가 `isNew={todo.id === recentlyAddedId}`로 TodoItem에 전달 → `.slideIn` CSS 애니메이션 트리거.

**탭 전환 페이드**: `<TodoList key={activeTab} />` — key 변경으로 리마운트 → TodoList.module.css의 `animation: fadeIn` 자동 재생.

**localStorage 키**: `pebble_personal`, `pebble_work`, `pebble_active_tab`.

**레이아웃**: `app-container`는 `max-width: 430px`, `height: 100dvh`, flex column. TodoList가 `flex: 1 + overflow-y: auto`로 스크롤 영역 담당. AddTodoBar는 `flex-shrink: 0`으로 하단 고정.
