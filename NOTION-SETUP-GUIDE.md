# Notion MCP 설정 및 프로젝트 관리 가이드

이 문서는 Bitget 암호화폐 거래 시스템 프로젝트를 Notion에서 관리하기 위한 설정 가이드입니다.

---

## 📋 목차

1. [Notion MCP란?](#notion-mcp란)
2. [Notion Integration 생성](#notion-integration-생성)
3. [Notion MCP 설정](#notion-mcp-설정)
4. [프로젝트 데이터 임포트](#프로젝트-데이터-임포트)
5. [Notion 데이터베이스 구조](#notion-데이터베이스-구조)
6. [진척 사항 관리](#진척-사항-관리)

---

## 🤖 Notion MCP란?

**MCP (Model Context Protocol)**는 AI 어시스턴트가 외부 서비스와 통합할 수 있도록 하는 프로토콜입니다. Notion MCP를 사용하면 Claude Code가 직접 Notion API를 호출하여 페이지, 데이터베이스, 태스크를 생성하고 관리할 수 있습니다.

### 주요 기능
- ✅ 자동으로 Notion 페이지 생성
- ✅ 데이터베이스에 Epic, User Story, Task 추가
- ✅ 진척 사항 실시간 업데이트
- ✅ 마크다운 형식의 문서 자동 변환

---

## 🔑 Notion Integration 생성

### 1. Notion 개발자 페이지 접속

1. [Notion Developers](https://www.notion.so/my-integrations) 접속
2. 로그인 (Notion 계정 필요)

### 2. New Integration 생성

1. **"+ New integration"** 버튼 클릭
2. 정보 입력:
   - **Name**: `Bitget Trading System MCP`
   - **Logo**: (선택) 프로젝트 로고 업로드
   - **Associated workspace**: 본인의 워크스페이스 선택
3. **Submit** 클릭

### 3. Integration Token 복사

생성 후 표시되는 **Internal Integration Token**을 복사합니다.
```
형식: secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **중요**: 이 토큰은 외부에 노출되지 않도록 주의하세요!

### 4. Integration 권한 설정

**Capabilities** 섹션에서 다음 권한을 활성화합니다:
- ✅ Read content
- ✅ Update content
- ✅ Insert content

---

## ⚙️ Notion MCP 설정

### Claude Code에서 MCP 설정

#### 방법 1: 환경 변수 설정

```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
export NOTION_API_KEY="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export NOTION_DATABASE_ID="your-database-id-here"
```

적용:
```bash
source ~/.bashrc  # 또는 source ~/.zshrc
```

#### 방법 2: MCP 설정 파일 생성

Claude Code 설정 디렉토리에 MCP 설정 파일 생성:

```json
// ~/.config/claude-code/mcp-config.json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/client"],
      "env": {
        "NOTION_API_KEY": "secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

---

## 📥 프로젝트 데이터 임포트

### 방법 1: CSV 파일 임포트 (수동)

프로젝트에 이미 준비된 CSV 파일을 사용합니다:
- **파일**: `notion-import-tasks.csv`

#### 단계:

1. **Notion에서 새 데이터베이스 생성**
   - Notion 워크스페이스 열기
   - "Private" 페이지 생성 또는 기존 페이지 선택
   - `/database` 입력 후 "Database - Full page" 선택
   - 데이터베이스 이름: **"Bitget Trading System - Tasks"**

2. **데이터베이스 프로퍼티 설정**
   - Type (Select): Epic, User Story, Task
   - Title (Title): 제목
   - Status (Select): 완료, 진행중, 대기
   - Priority (Select): P0, P1, P2, P3
   - Story Points (Number)
   - Epic (Relation): Epic 참조
   - Description (Text)
   - Tags (Multi-select)

3. **CSV 임포트**
   - 데이터베이스 우측 상단 **"⋮"** 메뉴 클릭
   - **"Merge with CSV"** 선택
   - `notion-import-tasks.csv` 파일 업로드
   - 컬럼 매핑 확인 후 **"Import"** 클릭

4. **Integration 연결**
   - 데이터베이스 페이지 우측 상단 **"⋮"** 메뉴
   - **"Connections"** → **"Bitget Trading System MCP"** 선택

5. **데이터베이스 ID 복사**
   - 데이터베이스 URL에서 ID 확인:
     ```
     https://www.notion.so/{workspace}/{database-id}?v={view-id}
     ```
   - `database-id` 부분을 복사하여 환경 변수에 설정

---

### 방법 2: Notion MCP를 통한 자동 생성 (MCP 설정 후)

Notion MCP가 설정된 후, Claude Code를 통해 자동으로 생성할 수 있습니다:

```bash
# Claude Code에서 실행
claude code notion create-database \
  --name "Bitget Trading System" \
  --parent "Private" \
  --import "notion-import-tasks.csv"
```

---

## 🗂️ Notion 데이터베이스 구조

### 권장 데이터베이스 뷰

#### 1. **All Tasks** (기본 테이블 뷰)
- 모든 Epic, User Story, Task 표시
- 그룹화: Type → Epic
- 정렬: Priority (오름차순), Status

#### 2. **Kanban Board** (보드 뷰)
- 그룹화: Status
- 필터: Type = Task
- 열: 대기 → 진행중 → 완료

#### 3. **Sprint Planning** (타임라인 뷰)
- 필터: Type = User Story 또는 Epic
- 타임라인: 시작일 ~ 종료일
- 그룹화: Epic

#### 4. **Epic Overview** (갤러리 뷰)
- 필터: Type = Epic
- 카드 프리뷰: Description
- 그룹화: Status

---

## 📊 진척 사항 관리

### 1. 대시보드 페이지 생성

Notion에서 **"Bitget Trading System - Dashboard"** 페이지 생성:

#### 구성 요소:

**📌 프로젝트 개요**
- BMAD 문서 링크 (`BMAD-PROJECT.md` 내용 임베드)
- 현재 Phase 상태
- 다음 Sprint 목표

**📈 진행률 차트**
```notion
Linked Database: "Bitget Trading System - Tasks"
View: Formula (진행률 계산)
```

진행률 계산 Formula:
```
prop("Status") == "완료" ? 100 : (prop("Status") == "진행중" ? 50 : 0)
```

**🎯 현재 Sprint**
```notion
Linked Database: "Bitget Trading System - Tasks"
Filter: Status = 진행중
View: Board (Status별 그룹화)
```

**✅ 완료된 작업 (이번 주)**
```notion
Linked Database: "Bitget Trading System - Tasks"
Filter:
  - Status = 완료
  - Last edited time is within 1 week
Sort: Last edited time (descending)
```

**📋 다음 할 일**
```notion
Linked Database: "Bitget Trading System - Tasks"
Filter: Status = 대기
Sort: Priority (P0 먼저)
Limit: 10
```

---

### 2. Epic별 진척 사항 추적

각 Epic에 대해 진척률을 자동 계산하는 Rollup 프로퍼티 추가:

#### Epic 데이터베이스에 프로퍼티 추가:

1. **Related Stories** (Relation)
   - Type: Relation
   - Related to: Tasks 데이터베이스
   - Filter: Type = User Story, Epic = (this)

2. **Completed Stories** (Rollup)
   - Relation: Related Stories
   - Property: Status
   - Calculate: Count values → where Status = 완료

3. **Total Stories** (Rollup)
   - Relation: Related Stories
   - Property: Status
   - Calculate: Count all

4. **Progress** (Formula)
   - Formula:
     ```
     round(prop("Completed Stories") / prop("Total Stories") * 100)
     ```

---

### 3. 자동화 (Notion Automation)

#### 작업 완료 시 자동 알림:

1. Notion 데이터베이스에서 **"Automate"** 클릭
2. **Trigger**: When Status changes to 완료
3. **Action**: Send notification
4. **Message**: `✅ [Task Title] 완료!`

#### Epic 완료 시 축하 메시지:

1. **Trigger**: When Progress equals 100
2. **Action**: Send notification
3. **Message**: `🎉 [Epic Name] Epic 완료! 모든 User Story가 완료되었습니다.`

---

## 🔄 실시간 동기화 (Notion MCP 사용)

Notion MCP가 설정되면, Claude Code가 자동으로 진척 사항을 업데이트할 수 있습니다:

### 사용 예시:

```bash
# Task 상태 업데이트
claude code notion update-task \
  --id "task-id" \
  --status "완료"

# 새 Task 추가
claude code notion create-task \
  --title "새로운 기능 구현" \
  --type "Task" \
  --epic "Epic 1: 사용자 인증" \
  --priority "P1"

# Epic 진척 사항 확인
claude code notion get-progress \
  --epic "Epic 4: 자동매매 전략 엔진"
```

---

## 📱 Notion 템플릿 활용

### Task 템플릿 생성

각 Type별로 템플릿을 만들어 일관성을 유지합니다:

#### Epic 템플릿:
```markdown
## 목표
[Epic의 주요 목표]

## 배경
[왜 이 Epic이 필요한가?]

## 범위
- [ ] User Story 1
- [ ] User Story 2
- [ ] User Story 3

## 성공 기준
- [ ] 기준 1
- [ ] 기준 2
```

#### User Story 템플릿:
```markdown
**As a** [사용자 역할]
**I want to** [원하는 기능]
**So that** [목적/이유]

## 인수 기준 (Acceptance Criteria)
- [ ] AC 1
- [ ] AC 2
- [ ] AC 3

## Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
```

---

## 🎨 Notion 페이지 구조 권장 사항

```
📁 Private (또는 원하는 부모 페이지)
├── 📄 Bitget Trading System - Dashboard
├── 📊 Bitget Trading System - Tasks (Database)
├── 📖 BMAD Project Document
│   └── (BMAD-PROJECT.md 내용)
├── 📝 Epic & User Stories
│   └── (EPIC-USER-STORIES.md 내용)
└── 📂 Sprints
    ├── 📅 Sprint 1 - 기본 기능
    ├── 📅 Phase 2 - 고급 기능
    └── 📅 Phase 3 - 확장 기능 (예정)
```

---

## ✅ 체크리스트: Notion 설정 완료 확인

- [ ] Notion Integration 생성 완료
- [ ] Integration Token 복사 및 환경 변수 설정
- [ ] Private 페이지에 프로젝트 폴더 생성
- [ ] Tasks 데이터베이스 생성
- [ ] CSV 파일 임포트 완료
- [ ] Integration을 데이터베이스에 연결
- [ ] 다양한 뷰 생성 (All Tasks, Kanban, Sprint, Epic)
- [ ] Dashboard 페이지 생성
- [ ] Epic 진척률 자동 계산 설정
- [ ] BMAD 문서 페이지 추가
- [ ] Epic & User Stories 문서 페이지 추가

---

## 🆘 문제 해결

### Q: CSV 임포트 시 에러가 발생합니다.
**A**: 다음을 확인하세요:
- CSV 파일 인코딩이 UTF-8인지 확인
- 컬럼명이 정확히 일치하는지 확인
- Relation 타입 프로퍼티는 수동으로 연결해야 할 수 있음

### Q: Notion MCP가 연결되지 않습니다.
**A**: 다음을 확인하세요:
- Integration Token이 정확한지 확인
- Integration이 해당 페이지에 연결되어 있는지 확인
- 환경 변수가 올바르게 설정되었는지 확인

### Q: 진척률이 자동으로 계산되지 않습니다.
**A**:
- Rollup 프로퍼티가 올바르게 설정되었는지 확인
- Relation이 정확히 연결되어 있는지 확인
- Formula 문법 오류가 없는지 확인

---

## 📚 추가 리소스

- [Notion API 공식 문서](https://developers.notion.com/)
- [Notion Integration 가이드](https://www.notion.so/help/create-integrations-with-the-notion-api)
- [MCP 프로토콜 문서](https://modelcontextprotocol.io/)
- [Claude Code MCP 가이드](https://docs.claude.com/claude-code/mcp)

---

**마지막 업데이트**: 2025-11-17

프로젝트 관리에 행운을 빕니다! 🚀
