#!/usr/bin/env node
const { Client } = require('@notionhq/client');

// 환경 변수에서 Notion API 자격 증명 읽기
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('❌ 환경 변수가 설정되지 않았습니다!');
  console.error('다음 명령어로 환경 변수를 설정하세요:');
  console.error('  export NOTION_API_KEY="your_api_key_here"');
  console.error('  export NOTION_DATABASE_ID="your_database_id_here"');
  console.error('\n또는 .env.notion 파일을 로드하세요:');
  console.error('  source .env.notion');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

async function testConnection() {
  try {
    console.log('🔄 Notion API 연결 테스트 중...');
    console.log(`   Database ID: ${NOTION_DATABASE_ID}\n`);

    const response = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID });

    console.log('✅ 연결 성공!');
    console.log(`   Database: ${response.title[0]?.plain_text || 'Untitled'}`);
    console.log(`   Properties: ${Object.keys(response.properties).length}개`);
    return true;
  } catch (error) {
    console.error('❌ 연결 실패:', error.message);
    if (error.code === 'object_not_found') {
      console.error('\n💡 Integration을 Database에 연결했는지 확인하세요!');
    }
    return false;
  }
}

testConnection().then(success => process.exit(success ? 0 : 1));
