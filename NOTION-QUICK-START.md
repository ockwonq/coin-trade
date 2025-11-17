# 🚀 Notion 프로젝트 관리 빠른 시작 가이드

**소요 시간**: 5분

이미 준비된 CSV 파일로 Bitget Trading System의 모든 Epic, User Story, Task를 Notion에 즉시 임포트할 수 있습니다.

---

## 📋 준비물

✅ **이미 준비됨**:
- `notion-import-tasks.csv` - 90개 항목 (6 Epic, 19 User Story, 60+ Task)
- Notion Integration 연결 완료

---

## ⚡ 3단계로 끝내기

### Step 1: Notion에서 데이터베이스 생성 (1분)

1. **Notion 열기** (웹 또는 앱)
2. **Private 페이지** 또는 원하는 워크스페이스 선택
3. 새 페이지 만들기:
   - 페이지 이름: **"Bitget Trading System"** 입력
4. 데이터베이스 추가:
   - 페이지 안에서 `/database` 입력
   - **"Table - Inline"** 또는 **"Database - Full page"** 선택
   - 데이터베이스 이름: **"Tasks"**

### Step 2: CSV 파일 임포트 (2분)

1. **CSV 파일 다운로드**:
   ```bash
   # 프로젝트에 이미 있습니다
   /home/user/coin-trade/notion-import-tasks.csv
   ```

   또는 로컬 PC로 복사하여 사용하세요.

2. **데이터베이스에 임포트**:
   - 데이터베이스 우측 상단 **"⋮"** (더보기) 클릭
   - **"Merge with CSV"** 선택
   - `notion-import-tasks.csv` 파일 선택
   - 컬럼 매핑 확인:
     - Type → Type
     - Title → Title
     - Status → Status
     - Priority → Priority
     - Story Points → Story Points
     - Epic → Epic
     - Description → Description
     - Tags → Tags
   - **"Import"** 클릭

3. **자동으로 임포트됩니다**:
   - ✅ 6개 Epic
   - ✅ 19개 User Story (95% 완료)
   - ✅ 60+ Task (상세 구현 작업)

### Step 3: 뷰 설정 (2분)

#### 기본 뷰 정리

1. **All Tasks** (테이블 뷰)
   - 현재 뷰 이름을 "All Tasks"로 변경
   - 그룹화: **Type** → **Epic**
   - 정렬: **Priority** (오름차순)
   - 필터: 없음 (전체 표시)

2. **Kanban Board** (보드 뷰 추가)
   - 우측 상단 **"+ Add a view"** 클릭
   - **"Board"** 선택
   - 이름: "Kanban Board"
   - 그룹화: **Status**
   - 필터: Type = "Task" (Task만 표시)
   - 표시 순서: 대기 → 진행중 → 완료

3. **Epic Overview** (갤러리 뷰 추가)
   - **"+ Add a view"** → **"Gallery"**
   - 이름: "Epic Overview"
   - 필터: Type = "Epic"
   - 카드 프리뷰: Description
   - 그룹화: Status

---

## 🎨 데이터베이스 구조

임포트된 데이터 구조:

```
📊 Bitget Trading System - Tasks Database

Columns:
├── Type (Select): Epic, User Story, Task
├── Title (Title): 항목 이름
├── Status (Select): 완료, 진행중, 대기
├── Priority (Select): P0, P1, P2, P3
├── Story Points (Number): 작업 복잡도
├── Epic (Text): 상위 Epic 이름
├── Description (Text): 상세 설명
└── Tags (Text): 관련 태그

Items:
├── 6 Epics
│   ├── Epic 1: 사용자 인증 및 계정 관리 ✅
│   ├── Epic 2: 실시간 시장 데이터 ✅
│   ├── Epic 3: 수동 거래 시스템 ✅
│   ├── Epic 4: 자동매매 전략 엔진 ✅
│   ├── Epic 5: 분석 및 리포팅 ✅
│   └── Epic 6: 보안 및 리스크 관리 🔄
│
├── 19 User Stories (18 완료, 1 진행중)
│
└── 60+ Tasks (구현 상세 작업)
```

---

## 📈 고급 기능 (선택)

### 1. Epic별 진척률 자동 계산

**Relation 프로퍼티 추가**:
1. 새 프로퍼티 **"Related Stories"** 추가
   - Type: Relation
   - Related database: Tasks (자기 자신)

2. 필터 설정:
   - Epic = (this Epic's title)
   - Type = User Story

**Rollup으로 진척률 계산**:
1. **"Completed Stories"** 프로퍼티 추가
   - Type: Rollup
   - Relation: Related Stories
   - Property: Status
   - Calculate: Count values → where Status = 완료

2. **"Total Stories"** 프로퍼티 추가
   - Type: Rollup
   - Calculate: Count all

3. **"Progress %"** 프로퍼티 추가
   - Type: Formula
   - Formula: `round(prop("Completed Stories") / prop("Total Stories") * 100)`

### 2. 대시보드 페이지 생성

**"Bitget Trading System - Dashboard"** 페이지 만들기:

```markdown
# Bitget Trading System Dashboard

## 📊 프로젝트 개요
[BMAD-PROJECT.md 내용 요약]

## 🎯 현재 진행 상황
[Linked Database: Tasks, Filter: Status = 진행중]

## ✅ 이번 주 완료 항목
[Linked Database: Tasks, Filter: Status = 완료 AND Last edited = This week]

## 📋 다음 할 일
[Linked Database: Tasks, Filter: Status = 대기, Sort: Priority, Limit: 10]

## 📈 Epic 진척률
[Linked Database: Tasks, Filter: Type = Epic, View: Table with Progress %]
```

### 3. 자동화 설정

**Notion Automation 추가** (선택):

1. **Task 완료 시 알림**:
   - Trigger: When Status → 완료
   - Action: Send notification
   - Message: "✅ {Title} 완료!"

2. **Epic 완료 시 축하**:
   - Trigger: When Progress % = 100
   - Action: Send notification
   - Message: "🎉 {Title} Epic 완료!"

---

## 🎯 완료 체크리스트

- [ ] Notion에 "Bitget Trading System" 페이지 생성
- [ ] Tasks 데이터베이스 생성
- [ ] notion-import-tasks.csv 파일 임포트
- [ ] All Tasks 뷰 설정 (그룹화: Type → Epic)
- [ ] Kanban Board 뷰 추가 (그룹화: Status)
- [ ] Epic Overview 갤러리 뷰 추가
- [ ] (선택) 진척률 자동 계산 프로퍼티 추가
- [ ] (선택) Dashboard 페이지 생성
- [ ] (선택) 자동화 설정

---

## 📊 임포트 후 예상 결과

### Epic별 현황:
| Epic | User Stories | 완료율 | 상태 |
|------|--------------|--------|------|
| Epic 1: 사용자 인증 | 3 | 100% | ✅ |
| Epic 2: 시장 데이터 | 3 | 100% | ✅ |
| Epic 3: 수동 거래 | 3 | 100% | ✅ |
| Epic 4: 자동매매 | 4 | 100% | ✅ |
| Epic 5: 분석 리포팅 | 3 | 100% | ✅ |
| Epic 6: 보안 리스크 | 3 | 67% | 🔄 |
| **전체** | **19** | **95%** | **18/19** |

### Phase별 현황:
- ✅ **Sprint 1**: 기본 기능 (100% 완료)
- ✅ **Phase 2**: 고급 기능 (100% 완료)
- 🔄 **Phase 3**: 확장 기능 (계획됨)
- 📅 **Phase 4**: AI/ML 통합 (계획됨)

---

## 🆘 문제 해결

### Q: CSV 임포트 시 한글이 깨집니다.
**A**: CSV 파일이 UTF-8로 인코딩되어 있는지 확인하세요. 이미 제공된 파일은 UTF-8입니다.

### Q: Relation 컬럼이 연결되지 않습니다.
**A**: Relation은 CSV 임포트 시 자동 연결이 안 됩니다. Epic 컬럼은 Text로 임포트되므로 수동으로 Relation으로 변환하거나, Text 그대로 사용하세요.

### Q: 일부 항목만 보입니다.
**A**: 필터를 확인하세요. "All Tasks" 뷰에서 필터를 모두 제거하면 전체 90개 항목이 보입니다.

---

## 📱 다음 단계

CSV 임포트가 완료되면:

1. **팀원 초대**:
   - 페이지 우측 상단 **"Share"** → 팀원 이메일 입력

2. **Integration 연결** (API 사용 시):
   - 페이지 **"⋮"** → **"Connections"** → Integration 선택

3. **일일 작업**:
   - Kanban Board에서 Task 상태 업데이트
   - 완료 시 "완료"로 드래그 앤 드롭

4. **주간 리뷰**:
   - Dashboard에서 이번 주 완료 항목 확인
   - 다음 주 우선순위 설정

---

## 🎊 완성!

CSV 파일 임포트만으로 **90개 항목**이 한 번에 Notion에 들어갑니다:
- 6개 Epic
- 19개 User Story
- 60+ Task
- 우선순위, 상태, 스토리 포인트, 태그 모두 포함

**BMAD-PROJECT.md**와 **EPIC-USER-STORIES.md**를 참고하여 각 항목의 상세 내용을 확인하세요!

---

**소요 시간**: 약 5분
**난이도**: ⭐ (매우 쉬움)

즐거운 프로젝트 관리 되세요! 🚀
