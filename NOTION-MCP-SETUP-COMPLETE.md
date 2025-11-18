# ✅ Notion MCP 설정 완료

**작성일**: 2025-11-18
**상태**: 설정 완료 (서버 환경에서 API 호출 제한)

---

## 📋 설정 완료 내역

### ✅ 1. Notion Integration 생성
- **Integration 이름**: Bitget Trading System MCP
- **Token**: `YOUR_NOTION_API_KEY_HERE`
- **권한**: Read, Update, Insert content

### ✅ 2. Notion Database 생성
- **Database ID**: `YOUR_DATABASE_ID_HERE`
- **이름**: Tasks (추정)

### ✅ 3. 환경 변수 설정
환경 변수가 다음 위치에 저장되었습니다:

**시스템 전역** (`~/.bashrc`):
```bash
export NOTION_API_KEY="YOUR_NOTION_API_KEY_HERE"
export NOTION_DATABASE_ID="YOUR_DATABASE_ID_HERE"
```

**프로젝트 로컬** (`.env.notion`):
```
NOTION_API_KEY=YOUR_NOTION_API_KEY_HERE
NOTION_DATABASE_ID=YOUR_DATABASE_ID_HERE
```

### ✅ 4. Notion Client 패키지 설치
```bash
npm install @notionhq/client
```

---

## ⚠️ 현재 환경 제약사항

현재 서버 환경에서는 **외부 API 호출이 제한**되어 있어 Notion API 연결 테스트를 완료할 수 없습니다.

**해결 방법**:
1. **CSV 수동 임포트** (권장)
2. **로컬 PC에서 MCP 테스트**

---

## 🚀 방법 1: CSV 수동 임포트 (권장)

가장 빠르고 확실한 방법입니다.

### 단계:
1. Notion에서 생성한 Database 열기
2. 우측 상단 **"⋮"** → **"Merge with CSV"**
3. `/home/user/coin-trade/notion-import-tasks.csv` 파일 업로드
4. 90개 항목 자동 임포트 완료!

**상세 가이드**: `NOTION-IMPORT-GUIDE.md` 참조

---

## 🖥️ 방법 2: 로컬 PC에서 MCP 테스트

### 2-1. 파일 다운로드

로컬 PC로 다음 파일들을 다운로드하세요:

```bash
# 테스트 스크립트
/home/user/coin-trade/scripts/test-notion-api.js

# 환경 변수 파일
/home/user/coin-trade/.env.notion

# CSV 데이터
/home/user/coin-trade/notion-import-tasks.csv
```

### 2-2. 로컬에서 테스트 실행

```bash
# 1. 프로젝트 디렉토리로 이동
cd /path/to/coin-trade

# 2. 환경 변수 로드
source .env.notion
# 또는
export NOTION_API_KEY="YOUR_NOTION_API_KEY_HERE"
export NOTION_DATABASE_ID="YOUR_DATABASE_ID_HERE"

# 3. npm 패키지 설치 (최초 1회)
npm install @notionhq/client

# 4. 연결 테스트 실행
node scripts/test-notion-api.js
```

### 예상 결과:

**성공 시**:
```
🔄 Notion API 연결 테스트 중...
✅ 연결 성공!
📋 Database: Tasks
```

**실패 시**:
```
❌ 연결 실패: object_not_found
💡 Integration을 Database에 연결했는지 확인하세요!
```

---

## 🔧 Integration 연결 확인

만약 `object_not_found` 에러가 발생하면:

### 단계:
1. Notion에서 **Database 페이지** 열기
2. 우측 상단 **"⋮"** (더보기) 클릭
3. **"Connections"** 또는 **"Add connections"** 클릭
4. **"Bitget Trading System MCP"** 체크
5. 다시 테스트 스크립트 실행

---

## 📊 Notion에 데이터 임포트하기

### CSV 파일 사용 (권장)

**파일**: `notion-import-tasks.csv`

**내용**:
- 6개 Epic
- 19개 User Story
- 60+ Task
- **총 90개 항목**

**임포트 방법**:
1. Database 페이지에서 우측 상단 **"⋮"** 클릭
2. **"Merge with CSV"** 선택
3. `notion-import-tasks.csv` 파일 업로드
4. 컬럼 매핑 확인 후 **"Import"** 클릭

**5분이면 완료됩니다!**

---

## 📁 생성된 파일 목록

```
/home/user/coin-trade/
├── .env.notion                    # Notion API 환경 변수
├── .gitignore                     # .env.notion 제외됨
├── scripts/
│   └── test-notion-api.js        # 연결 테스트 스크립트
├── notion-import-tasks.csv        # 임포트용 CSV 파일
├── BMAD-PROJECT-NOTION.md        # Notion용 프로젝트 문서
├── NOTION-IMPORT-GUIDE.md        # 수동 임포트 가이드
├── NOTION-QUICK-START.md         # 5분 빠른 시작
├── NOTION-SETUP-GUIDE.md         # MCP 설정 가이드
└── NOTION-MCP-SETUP-COMPLETE.md  # 본 문서
```

---

## 🎯 다음 단계

### 즉시 실행 (권장):
1. **CSV 파일로 Notion에 임포트**
   - `NOTION-IMPORT-GUIDE.md` 참조
   - 5분이면 90개 항목 완료

### 추후 실행 (선택):
2. **로컬 PC에서 MCP 테스트**
   - `scripts/test-notion-api.js` 실행
   - Integration 연결 확인

3. **Notion 페이지에 BMAD 문서 추가**
   - `BMAD-PROJECT-NOTION.md` 복사
   - Notion 페이지에 붙여넣기

---

## 📞 문제 해결

### Q: CSV 임포트가 안 됩니다
**A**: 
- CSV 파일이 UTF-8 인코딩인지 확인
- 컬럼명이 정확히 일치하는지 확인
- 브라우저 새로고침 후 다시 시도

### Q: Integration 연결이 안 됩니다
**A**:
- Database 페이지에서 **"Connections"** 확인
- Integration 이름: "Bitget Trading System MCP"
- 체크박스가 선택되어 있는지 확인

### Q: 로컬 PC에서 테스트가 실패합니다
**A**:
- 환경 변수가 올바르게 설정되었는지 확인
- `@notionhq/client` 패키지가 설치되었는지 확인
- Integration이 Database에 연결되었는지 확인

---

## 🎉 축하합니다!

Notion MCP 설정이 완료되었습니다!

**설정 완료 항목**:
- ✅ Notion Integration Token 발급
- ✅ Database 생성
- ✅ 환경 변수 설정
- ✅ npm 패키지 설치
- ✅ 테스트 스크립트 생성

**이제 할 일**:
- CSV 파일로 데이터 임포트 (5분)
- BMAD 문서 Notion에 추가 (5분)
- 프로젝트 관리 시작! 🚀

---

**작성일**: 2025-11-18
**버전**: 1.0
