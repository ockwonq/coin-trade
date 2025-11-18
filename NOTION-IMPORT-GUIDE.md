# 🚀 Notion 수동 임포트 가이드 (MCP 없이)

**소요 시간**: 5분
**필요한 것**: Notion 계정만 있으면 됨!

---

## 📥 Step 1: CSV 파일 다운로드

프로젝트에 준비된 CSV 파일:
```
/home/user/coin-trade/notion-import-tasks.csv
```

**로컬 PC로 다운로드**:
- SSH/SFTP로 접속 중이라면 파일을 다운로드하세요
- 또는 아래 내용을 복사하여 직접 CSV 파일을 생성하세요

---

## 🗂️ Step 2: Notion 데이터베이스 생성

### 2-1. 새 페이지 생성
1. **Notion** 열기 (웹 또는 앱)
2. 좌측 사이드바에서 **"+ Add a page"** 클릭
3. 페이지 제목: **"Bitget Trading System"** 입력

### 2-2. 데이터베이스 추가
1. 페이지 안에서 **`/database`** 입력
2. **"Table - Full page"** 선택
3. 데이터베이스 이름: **"Tasks"**

### 2-3. 컬럼 설정
기본 "Name" 컬럼 외에 다음 컬럼을 추가하세요:

| 컬럼명 | 타입 | 옵션 |
|--------|------|------|
| Title | Title | (기본) |
| Type | Select | Epic, User Story, Task |
| Status | Select | 완료, 진행중, 대기 |
| Priority | Select | P0, P1, P2, P3 |
| Story Points | Number | - |
| Epic | Text | - |
| Description | Text | - |
| Tags | Text | - |

**컬럼 추가 방법**:
- 테이블 우측 **"+"** 버튼 클릭
- 컬럼 타입 선택
- 컬럼 이름 입력

**Select 타입 옵션 추가**:
- Type: Epic, User Story, Task
- Status: 완료, 진행중, 대기
- Priority: P0, P1, P2, P3

---

## 📤 Step 3: CSV 임포트

### 3-1. CSV 파일 업로드
1. 데이터베이스 우측 상단 **"⋮"** (더보기) 클릭
2. **"Merge with CSV"** 선택
3. `notion-import-tasks.csv` 파일 선택

### 3-2. 컬럼 매핑
자동으로 매핑되지만, 확인하세요:

```
CSV 컬럼      →  Notion 프로퍼티
─────────────────────────────────
Type         →  Type
Title        →  Title (Name)
Status       →  Status
Priority     →  Priority
Story Points →  Story Points
Epic         →  Epic
Description  →  Description
Tags         →  Tags
```

### 3-3. 임포트 실행
**"Import"** 버튼 클릭

**임포트 결과**:
- ✅ 6개 Epic
- ✅ 19개 User Story
- ✅ 60+ Task
- ✅ 총 90개 항목

---

## 🎨 Step 4: 뷰 설정 (선택)

### 4-1. All Tasks 뷰 (기본)
현재 테이블 뷰 이름을 "All Tasks"로 변경

**그룹화 설정**:
1. 우측 상단 **"Group"** 클릭
2. **Type** 선택

**정렬 설정**:
1. 우측 상단 **"Sort"** 클릭
2. **Priority** (오름차순) → **Status**

### 4-2. Kanban Board 뷰 추가
1. 우측 상단 **"+ Add a view"** 클릭
2. **"Board"** 선택
3. 뷰 이름: **"Kanban Board"**
4. **Group by**: Status
5. **Filter**: Type = Task (Task만 표시)

**결과**: 대기 → 진행중 → 완료 칸반 보드

### 4-3. Epic Overview 뷰 추가
1. **"+ Add a view"** → **"Gallery"**
2. 뷰 이름: **"Epic Overview"**
3. **Filter**: Type = Epic
4. **Card preview**: Description
5. **Group by**: Status

**결과**: Epic들을 카드 형식으로 보기

---

## 📄 Step 5: BMAD 문서 페이지 추가

### 5-1. 새 페이지 생성
1. "Bitget Trading System" 부모 페이지로 돌아가기
2. 페이지 안에서 **"/"** 입력 → **"Page"** 선택
3. 페이지 제목: **"📖 BMAD Project Document"**

### 5-2. 문서 내용 붙여넣기
1. **BMAD-PROJECT-NOTION.md** 파일 열기
   - 위치: `/home/user/coin-trade/BMAD-PROJECT-NOTION.md`
2. 전체 내용 복사 (Ctrl+A, Ctrl+C)
3. Notion 페이지에 붙여넣기 (Ctrl+V)

**Notion이 자동으로 변환**:
- ✅ 헤딩 포맷팅
- ✅ 리스트 변환
- ✅ 테이블 변환
- ✅ 코드 블록 하이라이팅

---

## 📊 Step 6: Dashboard 생성 (선택)

### 6-1. Dashboard 페이지 생성
1. 새 페이지: **"📊 Dashboard"**
2. 제목 아래에 다음 섹션 추가

### 6-2. 구성 요소 추가

#### 📈 진행 중인 작업
```
/linked database → Tasks 선택
Filter: Status = 진행중
View: Board
```

#### ✅ 이번 주 완료
```
/linked database → Tasks 선택
Filter:
  - Status = 완료
  - Last edited time is within 1 week
Sort: Last edited time (descending)
Limit: 10
```

#### 📋 다음 할 일
```
/linked database → Tasks 선택
Filter: Status = 대기
Sort: Priority (P0 먼저)
View: Table
Limit: 10
```

#### 🎯 Epic 진행률
```
/linked database → Tasks 선택
Filter: Type = Epic
View: Table
Properties: Title, Status, Progress
```

---

## 🎊 완성!

### 최종 구조

```
Bitget Trading System (부모 페이지)
├── 📊 Dashboard
├── 📖 BMAD Project Document
├── 📋 Tasks (Database)
│   ├── 📑 All Tasks (Table View)
│   ├── 📌 Kanban Board (Board View)
│   └── 🎯 Epic Overview (Gallery View)
└── 📝 Epic & User Stories (선택)
```

### 임포트된 데이터

| Epic | User Stories | Tasks | 완료율 |
|------|--------------|-------|--------|
| Epic 1: 사용자 인증 | 3 | 14 | 100% ✅ |
| Epic 2: 시장 데이터 | 3 | 12 | 100% ✅ |
| Epic 3: 수동 거래 | 3 | 9 | 100% ✅ |
| Epic 4: 자동매매 | 4 | 16 | 100% ✅ |
| Epic 5: 분석 리포팅 | 3 | 12 | 100% ✅ |
| Epic 6: 보안 리스크 | 3 | 8 | 67% 🔄 |
| **전체** | **19** | **71** | **95%** |

---

## 🔄 일상 사용법

### 작업 상태 업데이트
1. **Kanban Board** 뷰로 이동
2. Task 카드를 드래그 앤 드롭으로 이동
   - 대기 → 진행중 (작업 시작)
   - 진행중 → 완료 (작업 완료)

### 새 Task 추가
1. 데이터베이스에서 **"+ New"** 클릭
2. 정보 입력:
   - Title: Task 이름
   - Type: Task
   - Epic: 속한 Epic 이름
   - Priority: P0/P1/P2/P3
   - Status: 대기

### 주간 리뷰
1. **Dashboard**에서 "이번 주 완료" 확인
2. "다음 할 일"에서 우선순위 조정
3. Epic Overview에서 전체 진행 상황 확인

---

## 💡 팁

### 빠른 필터링
- 특정 Epic만 보기: Filter → Epic = "Epic 이름"
- 완료된 작업 숨기기: Filter → Status ≠ 완료
- 우선순위 높은 작업만: Filter → Priority = P0

### 템플릿 활용
1. Task 하나를 잘 작성
2. 우측 상단 **"⋮"** → **"Template"**
3. 다음 Task 생성 시 템플릿 사용

### 팀 협업
1. 페이지 우측 상단 **"Share"**
2. 팀원 이메일 입력
3. 권한 설정 (Can edit / Can view)

---

## 🆘 문제 해결

### Q: CSV 임포트가 안 됩니다
**A**:
- CSV 파일이 UTF-8 인코딩인지 확인
- 브라우저를 새로고침 후 다시 시도
- 컬럼명이 정확히 일치하는지 확인

### Q: 한글이 깨집니다
**A**:
- CSV 파일을 텍스트 편집기로 열기
- "다른 이름으로 저장" → 인코딩: UTF-8
- 다시 임포트

### Q: 일부 항목만 보입니다
**A**:
- 뷰의 **Filter**를 확인하세요
- "All Tasks" 뷰에서 필터를 모두 제거
- 전체 90개 항목이 표시되어야 함

### Q: Relation이 연결되지 않습니다
**A**:
- Relation은 CSV 임포트로 자동 생성 안 됨
- Epic 컬럼은 Text 타입으로 사용
- 또는 수동으로 Relation 타입으로 변환 후 연결

---

## 📚 다음 단계

1. **매일**: Kanban Board에서 Task 상태 업데이트
2. **매주**: Dashboard에서 주간 리뷰
3. **매월**: Epic 진행률 확인 및 다음 Sprint 계획

---

**축하합니다! 🎉**

Notion에서 Bitget Trading System 프로젝트를 관리할 준비가 완료되었습니다!

CSV 임포트 하나로 **90개 항목**을 한 번에 가져왔습니다:
- 6개 Epic
- 19개 User Story
- 60+ Task

이제 프로젝트를 체계적으로 관리할 수 있습니다! 🚀

---

**작성일**: 2025-11-18
**버전**: 1.0
**파일**: NOTION-IMPORT-GUIDE.md
