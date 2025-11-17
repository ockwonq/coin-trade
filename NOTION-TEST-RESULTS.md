# Notion MCP 연결 테스트 결과

**테스트 일시**: 2025-11-17
**테스트 환경**: Claude Code (coin-trade 프로젝트)

---

## 📊 테스트 요약

### 현재 상태: ⚠️ Notion API 키 필요

Notion MCP 연결을 위한 모든 도구와 스크립트가 준비되었습니다. 실제 연결 테스트를 진행하려면 **Notion API 키**가 필요합니다.

---

## ✅ 완료된 작업

### 1. 환경 확인
- ✅ Node.js 및 npx 설치 확인 (v10.9.4)
- ✅ MCP 설정 파일 위치 확인
- ✅ 환경 변수 확인

### 2. 테스트 도구 생성
- ✅ `test-notion-connection.js` - Notion API 연결 테스트 스크립트
- ✅ `setup-notion-mcp.sh` - Notion MCP 자동 설정 스크립트

### 3. 테스트 스크립트 기능
`test-notion-connection.js`는 다음 기능을 제공합니다:
- **Test 1**: 사용자 정보 조회 (Bot ID, 이름 확인)
- **Test 2**: 접근 가능한 페이지 검색
- 상세한 에러 메시지 및 문제 해결 가이드

### 4. 자동 설정 스크립트 기능
`setup-notion-mcp.sh`는 다음을 자동으로 수행합니다:
- 환경 변수 파일에 `NOTION_API_KEY` 추가 (`.bashrc` 또는 `.zshrc`)
- MCP 설정 파일 생성 (`~/.config/claude-code/mcp-servers.json`)
- Notion SDK 설치 (`@notionhq/client`)
- API 연결 테스트 자동 실행

---

## 🔧 사용 방법

### Option 1: 빠른 테스트 (API 키가 있는 경우)

Notion API 키를 가지고 계신 경우:

```bash
# 설정 및 테스트를 한 번에 실행
./setup-notion-mcp.sh secret_your_api_key_here
```

또는 환경 변수로 설정:

```bash
export NOTION_API_KEY="secret_your_api_key_here"
./setup-notion-mcp.sh
```

### Option 2: 수동 테스트

API 키만 있으면 개별 테스트도 가능합니다:

```bash
# 연결 테스트만 실행
NOTION_API_KEY=secret_your_key node test-notion-connection.js
```

---

## 📝 Notion Integration 생성 방법

API 키가 없는 경우, 다음 단계를 따라 생성하세요:

### 1. Notion Integration 생성

1. 🌐 브라우저에서 https://www.notion.so/my-integrations 접속
2. 🔐 Notion 계정으로 로그인
3. ➕ **"+ New integration"** 버튼 클릭
4. 📝 Integration 정보 입력:
   - **Name**: `Bitget Trading System MCP`
   - **Logo**: (선택) 프로젝트 로고
   - **Associated workspace**: 본인의 워크스페이스 선택
5. ✅ **"Submit"** 클릭
6. 📋 생성된 **"Internal Integration Token"** 복사
   - 형식: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **중요**: 이 토큰은 비밀로 유지하세요!

### 2. Integration 권한 설정

**Capabilities** 섹션에서 다음 권한 활성화:
- ✅ **Read content** - 페이지 및 데이터베이스 읽기
- ✅ **Update content** - 기존 콘텐츠 수정
- ✅ **Insert content** - 새 콘텐츠 추가

### 3. Integration 연결

Integration을 생성한 후에는 **Notion 페이지에 연결**해야 접근 가능합니다:

1. Notion에서 페이지 열기 (또는 "Private" 페이지 생성)
2. 페이지 우측 상단 **"⋮"** (더보기) 클릭
3. **"Connections"** 선택
4. **"Bitget Trading System MCP"** 선택하여 연결
5. ✅ 확인 메시지에서 **"Confirm"** 클릭

---

## 🧪 예상 테스트 결과

### 성공 시:

```
🔄 Notion API 연결 테스트 중...

✅ Test 1: 사용자 정보 조회 성공
   - Bot ID: a1234567-89ab-cdef-0123-456789abcdef
   - Bot 이름: Bitget Trading System MCP
   - 타입: bot

✅ Test 2: 페이지 검색 성공
   - 접근 가능한 페이지 수: 5
   - 최근 페이지 목록:
     1. Private (page)
     2. My Projects (database)
     3. Tasks (database)
     4. Notes (page)
     5. Ideas (page)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Notion API 연결 테스트 완료!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Integration을 페이지에 연결하지 않은 경우:

```
✅ Test 2: 페이지 검색 성공
   - 접근 가능한 페이지 수: 0
   ⚠️  접근 가능한 페이지가 없습니다.
   → Integration을 Notion 페이지에 연결해야 합니다.
   → Notion 페이지에서 "..." → "Connections" → Integration 선택
```

### API 키가 잘못된 경우:

```
❌ Test 1: 사용자 정보 조회 실패 (Status: 401)
   응답: {"object":"error","status":401,"code":"unauthorized",...}
```

---

## 📂 생성된 파일 목록

프로젝트에 다음 파일들이 추가되었습니다:

```
coin-trade/
├── BMAD-PROJECT.md              # BMAD 방법론 프로젝트 문서
├── EPIC-USER-STORIES.md         # Epic, User Story, Task 구조
├── NOTION-SETUP-GUIDE.md        # Notion 설정 상세 가이드
├── NOTION-TEST-RESULTS.md       # 이 문서 (테스트 결과)
├── notion-import-tasks.csv      # Notion 임포트용 CSV (90개 항목)
├── test-notion-connection.js    # API 연결 테스트 스크립트
└── setup-notion-mcp.sh          # MCP 자동 설정 스크립트
```

---

## 🔄 다음 단계

### 1. Notion API 키 획득 (필수)
- 위의 "Notion Integration 생성 방법" 참조
- API 키 형식: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. MCP 설정 및 테스트
```bash
# 프로젝트 디렉토리에서 실행
./setup-notion-mcp.sh secret_your_api_key_here
```

### 3. Notion 페이지 구조 생성

MCP 연결이 성공하면:

#### a. Private 페이지 또는 프로젝트 폴더 생성
```
📁 Private (또는 원하는 이름)
└── 📁 Bitget Trading System
```

#### b. 데이터베이스 생성
- Notion에서 `/database` 입력
- "Database - Full page" 선택
- 이름: **"Bitget Trading System - Tasks"**

#### c. CSV 임포트
- 데이터베이스 우측 상단 **"⋮"** → **"Merge with CSV"**
- `notion-import-tasks.csv` 파일 업로드
- 컬럼 매핑 확인 후 **"Import"**

#### d. Integration 연결
- 데이터베이스 페이지 **"⋮"** → **"Connections"**
- **"Bitget Trading System MCP"** 선택

### 4. 데이터베이스 뷰 구성

`NOTION-SETUP-GUIDE.md`의 "Notion 데이터베이스 구조" 섹션 참고:
- **All Tasks**: 전체 보기 (테이블)
- **Kanban Board**: 상태별 보드 뷰
- **Sprint Planning**: 타임라인 뷰
- **Epic Overview**: 갤러리 뷰

### 5. 대시보드 설정

진척 사항을 한눈에 보기 위한 대시보드 페이지 생성:
- 프로젝트 개요
- 진행률 차트
- 현재 Sprint 작업
- 완료된 작업 (이번 주)
- 다음 할 일

자세한 내용은 `NOTION-SETUP-GUIDE.md` 참조

---

## 🎯 기대 효과

Notion MCP 연동 완료 시:

### 자동화된 작업 관리
- ✅ Epic, User Story, Task 자동 생성
- ✅ 진척 사항 실시간 업데이트
- ✅ 완료율 자동 계산

### 시각적 프로젝트 관리
- 📊 Kanban 보드로 작업 상태 관리
- 📈 진행률 차트 및 통계
- 🗓️ 타임라인 뷰로 스프린트 계획

### 팀 협업 강화
- 💬 댓글 및 토론
- 🔔 알림 및 멘션
- 📱 모바일 앱 지원

---

## ❓ 문제 해결

### Q: API 키는 어디서 확인하나요?
**A**: https://www.notion.so/my-integrations → 생성한 Integration → "Secrets" 탭

### Q: "unauthorized" 에러가 발생합니다.
**A**:
1. API 키가 올바른지 확인
2. Integration이 활성화되어 있는지 확인
3. 키에 공백이나 특수문자가 포함되지 않았는지 확인

### Q: 접근 가능한 페이지가 0개입니다.
**A**: Integration을 Notion 페이지에 연결해야 합니다:
- 페이지 → "⋮" → "Connections" → Integration 선택

### Q: MCP가 Claude Code에서 작동하지 않습니다.
**A**:
1. 새 터미널을 열거나 `source ~/.bashrc` 실행
2. MCP 설정 파일 확인: `cat ~/.config/claude-code/mcp-servers.json`
3. Claude Code 재시작

---

## 📚 참고 문서

- **NOTION-SETUP-GUIDE.md**: 상세한 설정 가이드
- **BMAD-PROJECT.md**: 프로젝트 전체 문서
- **EPIC-USER-STORIES.md**: Epic 및 User Story 상세 내용
- [Notion API 공식 문서](https://developers.notion.com/)
- [MCP 프로토콜](https://modelcontextprotocol.io/)

---

## 📞 지원

Notion 연동 관련 문제가 있으시면:
1. `NOTION-SETUP-GUIDE.md`의 "문제 해결" 섹션 참조
2. GitHub Issues에 문의
3. Notion API 문서 확인

---

**작성일**: 2025-11-17
**다음 업데이트**: Notion API 키 제공 후 실제 테스트 결과 추가 예정

---

## 🎬 Quick Start

```bash
# 1. Notion Integration 생성 (브라우저에서)
open https://www.notion.so/my-integrations

# 2. API 키 복사 후 설정 스크립트 실행
./setup-notion-mcp.sh secret_your_api_key_here

# 3. Notion에서 페이지에 Integration 연결
# (Notion 웹/앱에서 수동 작업)

# 4. CSV 임포트
# (Notion 데이터베이스에서 "Merge with CSV" 사용)

# 5. 완료! 🎉
```
