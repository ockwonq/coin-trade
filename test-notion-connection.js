#!/usr/bin/env node

/**
 * Notion API 연결 테스트 스크립트
 *
 * 사용법:
 * NOTION_API_KEY=your-key node test-notion-connection.js
 */

const https = require('https');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

if (!NOTION_API_KEY) {
  console.error('❌ NOTION_API_KEY 환경 변수가 설정되지 않았습니다.');
  console.error('');
  console.error('사용법:');
  console.error('  NOTION_API_KEY=secret_xxxxx node test-notion-connection.js');
  console.error('');
  console.error('Notion Integration 생성 방법:');
  console.error('  1. https://www.notion.so/my-integrations 접속');
  console.error('  2. "+ New integration" 클릭');
  console.error('  3. Integration 이름: "Bitget Trading System MCP"');
  console.error('  4. Internal Integration Token 복사');
  process.exit(1);
}

console.log('🔄 Notion API 연결 테스트 중...\n');

// Test 1: 사용자 정보 조회 (자신의 봇 정보)
function testUserInfo() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: '/v1/users/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const user = JSON.parse(data);
          console.log('✅ Test 1: 사용자 정보 조회 성공');
          console.log(`   - Bot ID: ${user.id}`);
          console.log(`   - Bot 이름: ${user.name || 'N/A'}`);
          console.log(`   - 타입: ${user.type}`);
          console.log('');
          resolve(user);
        } else {
          console.log(`❌ Test 1: 사용자 정보 조회 실패 (Status: ${res.statusCode})`);
          console.log(`   응답: ${data}`);
          console.log('');
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Test 1: 네트워크 에러');
      console.log(`   에러: ${error.message}`);
      console.log('');
      reject(error);
    });

    req.end();
  });
}

// Test 2: 페이지 검색 (봇이 접근 가능한 페이지 목록)
function testSearch() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      }
    });

    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: '/v1/search',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('✅ Test 2: 페이지 검색 성공');
          console.log(`   - 접근 가능한 페이지 수: ${result.results.length}`);

          if (result.results.length > 0) {
            console.log('   - 최근 페이지 목록:');
            result.results.slice(0, 5).forEach((page, idx) => {
              const title = page.properties?.title?.title?.[0]?.plain_text ||
                           page.properties?.Name?.title?.[0]?.plain_text ||
                           '제목 없음';
              console.log(`     ${idx + 1}. ${title} (${page.object})`);
            });
          } else {
            console.log('   ⚠️  접근 가능한 페이지가 없습니다.');
            console.log('   → Integration을 Notion 페이지에 연결해야 합니다.');
            console.log('   → Notion 페이지에서 "..." → "Connections" → Integration 선택');
          }
          console.log('');
          resolve(result);
        } else {
          console.log(`❌ Test 2: 페이지 검색 실패 (Status: ${res.statusCode})`);
          console.log(`   응답: ${data}`);
          console.log('');
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Test 2: 네트워크 에러');
      console.log(`   에러: ${error.message}`);
      console.log('');
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// 테스트 실행
async function runTests() {
  try {
    await testUserInfo();
    await testSearch();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Notion API 연결 테스트 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('다음 단계:');
    console.log('1. Notion에서 "Private" 페이지 또는 워크스페이스 페이지 선택');
    console.log('2. 페이지 우측 상단 "..." → "Connections" 클릭');
    console.log('3. "Bitget Trading System MCP" Integration 연결');
    console.log('4. 다시 이 스크립트를 실행하여 접근 가능한 페이지 확인');
    console.log('');

  } catch (error) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ Notion API 연결 테스트 실패');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('문제 해결:');
    console.log('1. NOTION_API_KEY가 올바른지 확인');
    console.log('2. Integration이 활성화되어 있는지 확인');
    console.log('3. 네트워크 연결 확인');
    console.log('');
    process.exit(1);
  }
}

runTests();
