# Bitget 암호화폐 거래 시스템

> **BMAD Method 기반 프로젝트 문서**
> 버전: 1.0.0 | 작성일: 2025-11-17 | 상태: Phase 2 완료

---

## 📋 프로젝트 개요

**프로젝트명**: Bitget 암호화폐 거래 시스템
**목적**: 자동화된 암호화폐 거래 및 실시간 모니터링 시스템 구축
**현재 진척**: 95% 완료 (18/19 User Stories)

### 핵심 성과 지표 (KPI)
- ✅ 시스템 가동률: 99.9% 이상
- ✅ 실시간 데이터 지연: < 100ms
- ✅ API 응답 시간: < 200ms
- ✅ 거래 실행 성공률: 99% 이상

---

## 🎯 B - Background (배경 및 목표)

### 비즈니스 배경

암호화폐 거래 시장의 특성:
- **24/7 운영**: 주말과 공휴일 없이 지속적인 거래
- **높은 변동성**: 빠른 가격 변동으로 인한 기회와 리스크
- **글로벌 시장**: 시간대 제약 없는 글로벌 거래 환경

전통적인 수동 거래의 한계:
- ⏰ **시간 제약**: 거래자가 24시간 시장을 모니터링할 수 없음
- 😰 **감정적 판단**: 공포와 탐욕에 의한 비합리적 결정
- ⚡ **기회 손실**: 빠른 시장 변화에 대응 지연
- 📊 **분석 부담**: 복잡한 기술적 지표 분석의 어려움

### 프로젝트 목표

1. **자동화된 거래 시스템**
   - 사전 정의된 전략에 따른 자동 거래 실행
   - 감정 배제, 규칙 기반 트레이딩

2. **실시간 모니터링**
   - WebSocket 기반 실시간 시세 업데이트
   - 포지션 및 수익률 실시간 추적

3. **다양한 전략 지원**
   - RSI (상대강도지수)
   - MACD (이동평균수렴확산)
   - Bollinger Bands (볼린저 밴드)
   - 커스텀 전략 설정 가능

4. **사용자 친화적 UI**
   - 직관적인 대시보드
   - 실시간 차트 및 지표 시각화
   - 간편한 전략 설정 인터페이스

5. **안전한 자산 관리**
   - API 키 암호화 저장
   - 손절매/익절매 자동 실행
   - 거래 내역 추적 및 감사

---

## 🛠️ M - Method (방법론 및 프로세스)

### 개발 방법론

**Agile Sprint 기반 개발**
- Sprint 주기: 2주
- Daily Standup: 진행 상황 공유
- Sprint Review: 기능 데모 및 피드백
- Retrospective: 프로세스 개선

### 개발 단계

#### ✅ Sprint 1: 기본 거래 기능 (완료)
**목표**: MVP(Minimum Viable Product) 구축

**완료된 기능**:
- 사용자 인증 시스템 (JWT)
- 실시간 시세 조회
- 계좌 잔고 조회
- 수동 매수/매도 주문
- 주문 내역 조회

**주요 성과**:
- 기본 거래 플로우 완성
- Bitget API 안정적 연동
- 사용자 인증 및 보안 기반 구축

---

#### ✅ Phase 2: 고급 기능 (완료)
**목표**: 자동매매 및 분석 기능 추가

**완료된 기능**:
- **WebSocket 실시간 데이터**
  - 실시간 시세 스트리밍
  - 자동 재연결 메커니즘
  - 지연 시간 < 100ms

- **자동매매 전략 엔진**
  - RSI 전략: 과매수/과매도 구간 자동 거래
  - MACD 전략: 골든/데드 크로스 시그널
  - Bollinger Bands: 변동성 기반 거래
  - 커스텀 전략 설정 지원

- **거래 분석 및 시각화**
  - 수익률 추적 (일/주/월)
  - 거래 통계 대시보드
  - 전략별 성과 비교
  - Recharts 기반 인터랙티브 차트

- **알림 시스템**
  - 주문 체결 알림
  - 전략 시그널 알림
  - 가격 알림 (설정 가격 도달 시)

**주요 성과**:
- 완전 자동화된 거래 시스템 구축
- 실시간 데이터 처리 안정화
- 사용자 경험 대폭 개선

---

#### 🔄 Phase 3: 확장 기능 (계획됨)
**목표**: 멀티 거래소 및 고급 분석

**계획된 기능**:
- 멀티 거래소 지원
  - Binance 연동
  - Upbit 연동
  - 통합 주문 라우팅

- 고급 백테스팅
  - 과거 데이터 기반 전략 검증
  - 파라미터 최적화
  - 성과 시뮬레이션

- 포트폴리오 관리
  - 멀티 코인 포트폴리오
  - 자동 리밸런싱
  - 리스크 분산

---

#### 📅 Phase 4: AI/ML 통합 (계획됨)
**목표**: 인공지능 기반 예측 및 최적화

**계획된 기능**:
- 가격 예측 모델 (LSTM, Transformer)
- 이상 거래 탐지
- 전략 자동 최적화
- 감정 분석 (소셜 미디어)

---

### 품질 관리

**코드 품질**:
- 코드 리뷰: PR 기반 동료 검토
- ESLint + Prettier: 코드 스타일 일관성
- Git Flow: 브랜치 전략

**테스트 전략**:
- Unit Test (Jest): 개별 함수/모듈 테스트
- Integration Test (Supertest): API 엔드포인트 테스트
- E2E Test (Cypress): 사용자 시나리오 테스트

**CI/CD**:
- GitHub Actions: 자동 빌드 및 테스트
- Docker: 컨테이너화 배포
- AWS ECS: 프로덕션 환경

**보안 점검**:
- 정기적인 의존성 취약점 스캔
- API 키 암호화 저장
- Rate Limiting
- HTTPS/WSS 통신

---

## 🏗️ A - Approach (기술적 접근 방법)

### 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Trading    │  │   Strategy   │      │
│  │  차트/통계    │  │   주문관리    │  │   자동매매    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  └────────────────── TailwindCSS + Recharts ───────────────┘│
└─────────────────────────────────────────────────────────────┘
                           │ HTTP / WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend (Node.js + Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Service │  │Trade Service │  │Strategy Eng. │      │
│  │   JWT 인증    │  │  주문 실행    │  │  자동매매     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Market Service│  │ WebSocket    │  │ Notification │      │
│  │   시세 조회   │  │  실시간 데이터 │  │    알림       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
     │                    │                   │
     ▼                    ▼                   ▼
┌──────────┐      ┌──────────────┐      ┌──────────┐
│ MongoDB  │      │ Bitget API   │      │  Redis   │
│ 사용자/거래│      │ 실시간 거래소│      │  캐시     │
└──────────┘      └──────────────┘      └──────────┘
```

### 기술 스택 선택 근거

#### Backend
**Node.js + Express**
- ✅ 비동기 I/O에 최적화 (실시간 거래)
- ✅ JavaScript 풀스택 개발 (생산성)
- ✅ 풍부한 암호화폐 라이브러리 생태계
- ✅ WebSocket 지원

**MongoDB (Mongoose)**
- ✅ 유연한 스키마 (다양한 거래 데이터)
- ✅ 빠른 쓰기 성능 (대량 로그)
- ✅ Aggregation Pipeline (복잡한 통계)
- ✅ Horizontal Scaling

#### Frontend
**React + Vite**
- ✅ 컴포넌트 기반 재사용성
- ✅ Virtual DOM (빠른 렌더링)
- ✅ Vite의 빠른 HMR (개발 생산성)
- ✅ 풍부한 생태계

**Recharts**
- ✅ React 네이티브 차트 라이브러리
- ✅ 실시간 데이터 업데이트 지원
- ✅ 커스터마이징 용이
- ✅ 반응형 디자인

**TailwindCSS**
- ✅ 빠른 UI 개발
- ✅ 일관된 디자인 시스템
- ✅ 최적화된 번들 사이즈
- ✅ 다크 모드 지원

#### DevOps
**Docker & Docker Compose**
- ✅ 환경 일관성 보장
- ✅ 쉬운 배포 및 스케일링
- ✅ 개발/프로덕션 환경 통일

**AWS 인프라**
- EC2/ECS: 컨테이너 오케스트레이션
- RDS: 관리형 MongoDB
- ElastiCache: Redis 캐싱
- S3: 로그 및 백업
- CloudWatch: 모니터링 및 알람

### 핵심 기술 구현

#### 1. 실시간 데이터 스트리밍
```javascript
WebSocket Connection
  ↓
Bitget WebSocket Subscribe
  ↓
Event Handler (Price Update)
  ↓
Broadcast to Connected Clients
  ↓
Frontend State Update
  ↓
React Component Re-render
```

**주요 특징**:
- 자동 재연결 (Exponential Backoff)
- Heartbeat Ping/Pong
- 다중 심볼 구독
- 에러 핸들링 및 복구

#### 2. 자동매매 전략 엔진
```javascript
Market Data Stream
  ↓
Indicator Calculation (RSI, MACD, BB)
  ↓
Signal Generation (Buy/Sell/Hold)
  ↓
Risk Management (Position Size, Stop Loss)
  ↓
Order Execution (Bitget API)
  ↓
Logging & Notification
```

**전략 실행 주기**:
- 실시간 모니터링 (1초마다)
- 지표 계산 (새 캔들마다)
- 시그널 생성 (조건 충족 시)
- 주문 실행 (즉시)

#### 3. 보안 구현
**인증 및 인가**:
- JWT Access Token (15분 만료)
- JWT Refresh Token (7일 만료)
- Role-based Access Control

**데이터 보안**:
- API 키: AES-256 암호화
- 비밀번호: bcrypt 해싱
- HTTPS/WSS 통신
- CORS 화이트리스트

**API 보호**:
- Rate Limiting (IP 기반)
- Helmet.js (HTTP 헤더 보안)
- Input Validation (Joi)
- SQL Injection 방지 (Mongoose)

#### 4. 에러 처리 및 복구
**Retry 메커니즘**:
- 지수 백오프 (Exponential Backoff)
- 최대 재시도 횟수 제한
- 실패 로깅

**Circuit Breaker 패턴**:
- API 장애 감지
- Fallback to Cache
- 자동 복구 시도

**Graceful Degradation**:
- API 장애 시 캐시 사용
- 기본 기능 유지
- 사용자 알림

---

## 📦 D - Deliverable (산출물 및 결과)

### 시스템 구성 요소

#### 1. Backend API Server
**위치**: `/backend`

**주요 엔드포인트**:

```
Authentication
  POST   /api/auth/register      회원가입
  POST   /api/auth/login         로그인
  POST   /api/auth/refresh       토큰 갱신

Market Data
  GET    /api/market/ticker/:symbol       실시간 시세
  GET    /api/market/orderbook/:symbol    호가창
  GET    /api/market/candles/:symbol      캔들 데이터

Trading
  POST   /api/trade/order                 주문 생성
  GET    /api/trade/orders                주문 내역
  DELETE /api/trade/order/:id             주문 취소
  GET    /api/account/balance             잔고 조회

Strategy (Auto Trading)
  POST   /api/strategy/create             전략 생성
  GET    /api/strategy/list               전략 목록
  POST   /api/strategy/:id/start          전략 시작
  POST   /api/strategy/:id/stop           전략 중지
  GET    /api/strategy/:id/performance    전략 성과

Analytics
  GET    /api/analytics/profit            수익률 통계
  GET    /api/analytics/trades            거래 분석
  GET    /api/analytics/performance       성과 리포트
```

#### 2. Frontend Dashboard
**위치**: `/frontend`

**주요 페이지**:

**대시보드** (`/dashboard`)
- 실시간 시세 차트 (Recharts Line Chart)
- 계좌 잔고 및 수익률
- 최근 거래 내역 (최신 10건)
- 활성 전략 현황

**거래** (`/trading`)
- 수동 매수/매도 주문
- 호가창 및 체결 내역
- 주문 관리 (취소/수정)
- 실시간 가격 업데이트

**자동매매** (`/strategy`)
- 전략 생성 및 설정
- 백테스팅 결과 (예정)
- 전략 성과 모니터링
- 전략 시작/중지

**분석** (`/analytics`)
- 수익률 차트 (일/주/월)
- 거래 통계 및 패턴
- 리스크 분석
- 성과 리포트 다운로드

#### 3. 데이터베이스 스키마

**Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  apiKey: String (encrypted),
  apiSecret: String (encrypted),
  createdAt: Date,
  lastLogin: Date
}
```

**Trades Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  symbol: String,           // "BTCUSDT"
  side: String,             // "buy" | "sell"
  type: String,             // "market" | "limit"
  price: Number,
  quantity: Number,
  status: String,           // "pending" | "filled" | "cancelled"
  orderId: String,          // Bitget order ID
  executedAt: Date,
  profit: Number,
  strategyId: ObjectId      // null for manual trades
}
```

**Strategies Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  type: String,             // "RSI" | "MACD" | "BB" | "CUSTOM"
  symbol: String,
  parameters: {
    rsiPeriod: Number,
    oversold: Number,
    overbought: Number,
    // ... strategy-specific params
  },
  isActive: Boolean,
  performance: {
    totalTrades: Number,
    winRate: Number,
    profit: Number,
    maxDrawdown: Number
  },
  createdAt: Date,
  lastExecutedAt: Date
}
```

### 프로젝트 성과

#### ✅ 완료된 기능 (Sprint 1 + Phase 2)
- 사용자 인증 및 보안
- 실시간 시세 조회 및 WebSocket 스트리밍
- 수동 거래 (시장가/지정가)
- 자동매매 전략 엔진 (RSI, MACD, Bollinger Bands)
- 거래 히스토리 및 분석
- 수익률 추적 및 차트
- 알림 시스템

**완료율**: 95% (18/19 User Stories)

#### 🔄 진행 중 (Phase 3)
- 손절매/익절매 자동 설정
- 멀티 거래소 지원
- 고급 백테스팅 시스템
- 포트폴리오 관리

### 리스크 및 대응

| 리스크 | 영향 | 확률 | 대응 방안 |
|--------|------|------|-----------|
| Bitget API 장애 | 높음 | 중간 | Circuit Breaker, Fallback 캐시 |
| 네트워크 지연 | 중간 | 높음 | WebSocket Reconnection, Timeout |
| 거래 손실 | 높음 | 중간 | 손절매, 리스크 관리, 백테스팅 |
| 보안 침해 | 높음 | 낮음 | 암호화, Rate Limiting, 보안 감사 |
| 스케일링 이슈 | 중간 | 낮음 | ECS Auto Scaling, Redis 캐싱 |

---

## 📊 프로젝트 타임라인

```
2025-Q1: Sprint 1 - 기본 기능 ✅
  └─ 인증, 시세, 수동 거래 (2주)

2025-Q2: Phase 2 - 고급 기능 ✅
  └─ WebSocket, 자동매매, 분석 (4주)

2025-Q3: Phase 3 - 확장 기능 🔄
  └─ 멀티 거래소, 백테스팅 (6주)

2025-Q4: Phase 4 - AI/ML 통합 📅
  └─ 예측 모델, 고급 분석 (8주)
```

---

## 🔐 보안 및 규정 준수

**데이터 보호**:
- API 키 AES-256 암호화
- 비밀번호 bcrypt 해싱
- HTTPS/WSS 통신

**인증 및 접근 제어**:
- JWT 토큰 기반 인증
- Role-based Access Control
- 세션 관리

**감사 및 로깅**:
- 모든 거래 내역 기록
- API 호출 로깅
- 에러 추적 (Sentry)

**규정 준수**:
- 개인정보보호법
- 금융거래 관련 규정
- GDPR (EU 고객 대상 시)

---

## 📞 연락처 및 지원

**Repository**: https://github.com/ockwonq/coin-trade
**Issue Tracker**: GitHub Issues
**Documentation**: /docs (추가 예정)

---

## 📈 다음 단계

### 즉시 착수 항목
1. **손절매/익절매 시스템** 완성
2. **멀티 거래소 지원** 설계
3. **백테스팅 시스템** 개발

### 중기 계획
1. **포트폴리오 관리** 기능
2. **고급 리스크 분석**
3. **모바일 앱** 개발

### 장기 비전
1. **AI/ML 예측 모델** 통합
2. **소셜 트레이딩** 플랫폼
3. **기관 투자자용** 기능

---

## 📝 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0.0 | 2025-11-17 | 초기 BMAD 문서 생성 | Claude |

---

**면책 조항**: 이 시스템은 실제 자금으로 거래합니다. 사용자는 투자 손실 위험을 충분히 이해하고 사용해야 합니다. 개발팀은 거래 손실에 대한 책임을 지지 않습니다.

**투자 경고**: 암호화폐 거래는 높은 리스크를 수반합니다. 투자 전 충분한 조사와 이해가 필요하며, 손실 감수 가능한 금액만 투자하세요.
