#!/bin/bash

# Notion MCP 자동 설정 스크립트
# 사용법: ./setup-notion-mcp.sh [NOTION_API_KEY]

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Notion MCP 설정 스크립트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# API 키 확인
NOTION_API_KEY="${1:-$NOTION_API_KEY}"

if [ -z "$NOTION_API_KEY" ]; then
  echo "❌ Notion API 키가 제공되지 않았습니다."
  echo ""
  echo "사용법:"
  echo "  ./setup-notion-mcp.sh secret_your_api_key_here"
  echo ""
  echo "또는 환경 변수 설정:"
  echo "  export NOTION_API_KEY=secret_your_api_key_here"
  echo "  ./setup-notion-mcp.sh"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📝 Notion Integration 생성 방법:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "1. 브라우저에서 https://www.notion.so/my-integrations 접속"
  echo "2. Notion 계정으로 로그인"
  echo "3. '+ New integration' 버튼 클릭"
  echo "4. Integration 정보 입력:"
  echo "   - Name: Bitget Trading System MCP"
  echo "   - Associated workspace: 본인의 워크스페이스 선택"
  echo "5. 'Submit' 클릭"
  echo "6. 생성된 'Internal Integration Token' 복사"
  echo "   (형식: secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx)"
  echo "7. Capabilities 설정:"
  echo "   ✓ Read content"
  echo "   ✓ Update content"
  echo "   ✓ Insert content"
  echo ""
  echo "토큰을 복사한 후 이 스크립트를 다시 실행하세요:"
  echo "  ./setup-notion-mcp.sh secret_your_token_here"
  echo ""
  exit 1
fi

echo "✅ Notion API 키 확인됨"
echo "   키: ${NOTION_API_KEY:0:20}..."
echo ""

# 1. 환경 변수 파일에 추가
echo "📝 1. 환경 변수 설정 중..."

ENV_FILE="$HOME/.bashrc"
if [ -f "$HOME/.zshrc" ]; then
  ENV_FILE="$HOME/.zshrc"
fi

# 기존 NOTION_API_KEY 제거
if grep -q "NOTION_API_KEY" "$ENV_FILE" 2>/dev/null; then
  echo "   기존 NOTION_API_KEY 발견, 업데이트 중..."
  sed -i '/export NOTION_API_KEY=/d' "$ENV_FILE"
fi

# 새 키 추가
echo "" >> "$ENV_FILE"
echo "# Notion API Configuration (added by setup-notion-mcp.sh)" >> "$ENV_FILE"
echo "export NOTION_API_KEY=\"$NOTION_API_KEY\"" >> "$ENV_FILE"

echo "   ✅ $ENV_FILE 에 NOTION_API_KEY 추가됨"
echo ""

# 2. MCP 설정 파일 생성
echo "📝 2. MCP 설정 파일 생성 중..."

MCP_CONFIG_DIR="$HOME/.config/claude-code"
mkdir -p "$MCP_CONFIG_DIR"

MCP_CONFIG_FILE="$MCP_CONFIG_DIR/mcp-servers.json"

cat > "$MCP_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": [
        "-y",
        "@notionhq/client"
      ],
      "env": {
        "NOTION_API_KEY": "$NOTION_API_KEY"
      }
    }
  }
}
EOF

echo "   ✅ MCP 설정 파일 생성됨: $MCP_CONFIG_FILE"
echo ""

# 3. Notion SDK 설치
echo "📦 3. Notion SDK 설치 중..."
if command -v npm &> /dev/null; then
  npm install -g @notionhq/client 2>&1 | grep -v "npm WARN" || true
  echo "   ✅ Notion SDK 설치 완료"
else
  echo "   ⚠️  npm이 설치되어 있지 않습니다. SDK는 필요 시 자동으로 다운로드됩니다."
fi
echo ""

# 4. 연결 테스트
echo "🧪 4. Notion API 연결 테스트 중..."
echo ""

export NOTION_API_KEY
node /home/user/coin-trade/test-notion-connection.js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Notion MCP 설정 완료!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "설정 파일 위치:"
echo "  - 환경 변수: $ENV_FILE"
echo "  - MCP 설정: $MCP_CONFIG_FILE"
echo ""
echo "다음 단계:"
echo "1. 새 터미널을 열거나 다음 명령 실행:"
echo "   source $ENV_FILE"
echo ""
echo "2. Notion 페이지에 Integration 연결:"
echo "   a. Notion에서 페이지 열기 (또는 새로 만들기)"
echo "   b. 페이지 우측 상단 '...' 클릭"
echo "   c. 'Connections' → 'Bitget Trading System MCP' 선택"
echo ""
echo "3. CSV 파일 임포트:"
echo "   - Notion에서 데이터베이스 생성"
echo "   - notion-import-tasks.csv 파일 임포트"
echo ""
echo "자세한 내용은 NOTION-SETUP-GUIDE.md 참조"
echo ""
