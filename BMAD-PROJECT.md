# BMAD 프로젝트 문서: Bitget 암호화폐 거래 시스템

## 📋 프로젝트 개요

**프로젝트명**: Bitget 암호화폐 거래 시스템
**버전**: 1.0.0
**작성일**: 2025-11-17
**상태**: Phase 2 완료 (추가 기능 개발 중)

---

## 🎯 B - Background (배경 및 목표)

### 비즈니스 배경

암호화폐 거래 시장은 24/7 운영되며 빠른 변동성을 보입니다. 전통적인 수동 거래는 다음과 같은 한계가 있습니다:

- **시간 제약**: 거래자가 항상 시장을 모니터링할 수 없음
- **감정적 판단**: 공포와 탐욕에 의한 비합리적 거래 결정
- **기회 손실**: 빠른 시장 변화에 대응 지연
- **분석 부담**: 복잡한 기술적 지표 분석의 어려움

### 프로젝트 목표

1. **자동화된 거래 시스템**: 사전 정의된 전략에 따른 자동 거래 실행
2. **실시간 모니터링**: WebSocket 기반 실시간 시세 및 거래 현황 추적
3. **다양한 전략 지원**: RSI, MACD, Bollinger Bands 등 기술적 지표 기반 전략
4. **사용자 친화적 UI**: 직관적인 대시보드와 거래 관리 인터페이스
5. **안전한 자산 관리**: 보안 강화 및 리스크 관리 기능

### 핵심 성과 지표 (KPI)

- 시스템 가동률 99.9% 이상
- 실시간 데이터 지연 시간 < 100ms
- API 응답 시간 < 200ms
- 거래 실행 성공률 99% 이상
- 사용자 자산 보안 무사고

---

## 🛠️ M - Method (방법론 및 프로세스)

### 개발 방법론

**Agile Sprint 기반 개발**
- Sprint 주기: 2주
- Daily Standup: 진행 상황 공유
- Sprint Review: 기능 데모 및 피드백
- Retrospective: 프로세스 개선

### 개발 단계

#### **Sprint 1: 기본 거래 기능 (완료 ✅)**
- 사용자 인증 시스템 (JWT)
- 실시간 시세 조회
- 계좌 잔고 조회
- 수동 매수/매도 주문
- 주문 내역 조회

#### **Phase 2: 고급 기능 (완료 ✅)**
- WebSocket 실시간 데이터 스트리밍
- 자동매매 전략 엔진
  - RSI (Relative Strength Index) 전략
  - MACD (Moving Average Convergence Divergence) 전략
  - Bollinger Bands 전략
  - 커스텀 전략 설정 지원
- 거래 히스토리 분석 및 시각화
- 수익률 추적 및 통계 대시보드
- 실시간 알림 시스템

#### **Phase 3: 확장 기능 (예정 🔄)**
- 멀티 거래소 지원 (Binance, Upbit 등)
- 고급 백테스팅 시스템
- 포트폴리오 관리 및 리밸런싱
- AI/ML 기반 예측 모델 통합
- 소셜 트레이딩 기능

### 품질 관리

- **코드 리뷰**: PR 기반 동료 검토
- **테스트 전략**:
  - Unit Test (Jest)
  - Integration Test (Supertest)
  - E2E Test (계획 중)
- **CI/CD**: GitHub Actions를 통한 자동 배포
- **보안 점검**: 정기적인 보안 취약점 스캔

---

## 🏗️ A - Approach (기술적 접근 방법)

### 아키텍처 설계

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Trading    │  │   Strategy   │      │
│  │   (차트/통계)  │  │   (주문관리)   │  │   (자동매매)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │ Axios HTTP / WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Service │  │Trade Service │  │Strategy Eng. │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Market Service│  │ WebSocket    │  │  Notification│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
           │                          │                   │
           ▼                          ▼                   ▼
    ┌──────────┐              ┌──────────┐        ┌──────────┐
    │ MongoDB  │              │ Bitget   │        │ Redis    │
    │          │              │   API    │        │ (Cache)  │
    └──────────┘              └──────────┘        └──────────┘
```

### 기술 스택 선택 근거

#### Backend
- **Node.js + Express**:
  - 비동기 I/O에 최적화 (실시간 거래에 적합)
  - JavaScript 풀스택 개발로 생산성 향상
  - 풍부한 암호화폐 관련 라이브러리 생태계

- **MongoDB (Mongoose)**:
  - 유연한 스키마 (다양한 거래 데이터 구조 대응)
  - 빠른 쓰기 성능 (대량의 거래 로그 저장)
  - Aggregation Pipeline (복잡한 통계 쿼리)

#### Frontend
- **React + Vite**:
  - 컴포넌트 기반 재사용성
  - Virtual DOM으로 빠른 렌더링
  - Vite의 빠른 HMR (개발 생산성)

- **Recharts**:
  - React 네이티브 차트 라이브러리
  - 실시간 데이터 업데이트 지원
  - 커스터마이징 용이

- **TailwindCSS**:
  - 빠른 UI 개발
  - 일관된 디자인 시스템
  - 최적화된 번들 사이즈

#### DevOps
- **Docker & Docker Compose**:
  - 환경 일관성 보장
  - 쉬운 배포 및 스케일링
  - 개발/프로덕션 환경 통일

- **AWS 인프라**:
  - EC2/ECS: 컨테이너 오케스트레이션
  - RDS: 관리형 MongoDB
  - S3: 로그 및 백업 저장
  - CloudWatch: 모니터링 및 알람

### 핵심 기술 구현

#### 1. 실시간 데이터 스트리밍
```javascript
// WebSocket을 통한 실시간 시세 업데이트
WebSocket → Event Handler → State Update → UI Rendering
```

#### 2. 자동매매 전략 엔진
```javascript
// 전략 실행 파이프라인
Market Data → Indicator Calculation → Signal Generation →
Risk Management → Order Execution → Logging
```

#### 3. 보안 구현
- JWT 기반 인증 (Access Token + Refresh Token)
- API 키 AES-256 암호화 저장
- Rate Limiting (IP 기반 요청 제한)
- Helmet.js (HTTP 헤더 보안)
- CORS 화이트리스트 설정

#### 4. 에러 처리 및 복구
- Retry 메커니즘 (지수 백오프)
- Circuit Breaker 패턴
- Graceful Degradation (API 장애 시 캐시 사용)
- Dead Letter Queue (실패한 주문 재처리)

---

## 📦 D - Deliverable (산출물 및 결과)

### 시스템 구성 요소

#### 1. Backend API Server
**위치**: `/backend`

**주요 모듈**:
- `src/controllers/`: API 엔드포인트 컨트롤러
  - authController.js - 인증/인가
  - tradeController.js - 거래 주문
  - marketController.js - 시세 조회
  - strategyController.js - 자동매매 전략
  - accountController.js - 계좌 관리

- `src/services/`: 비즈니스 로직
  - bitgetService.js - Bitget API 통합
  - strategyEngine.js - 자동매매 엔진
  - websocketService.js - 실시간 데이터
  - notificationService.js - 알림 발송

- `src/models/`: 데이터 모델
  - User.js - 사용자 정보
  - Trade.js - 거래 내역
  - Strategy.js - 전략 설정
  - Alert.js - 알림 설정

**API 엔드포인트**:
```
Authentication:
  POST   /api/auth/register      - 회원가입
  POST   /api/auth/login         - 로그인
  POST   /api/auth/refresh       - 토큰 갱신

Market Data:
  GET    /api/market/ticker/:symbol        - 실시간 시세
  GET    /api/market/orderbook/:symbol     - 호가창
  GET    /api/market/candles/:symbol       - 캔들 데이터

Trading:
  POST   /api/trade/order                  - 주문 생성
  GET    /api/trade/orders                 - 주문 내역
  DELETE /api/trade/order/:id              - 주문 취소
  GET    /api/account/balance              - 잔고 조회

Strategy (Auto Trading):
  POST   /api/strategy/create              - 전략 생성
  GET    /api/strategy/list                - 전략 목록
  POST   /api/strategy/:id/start           - 전략 시작
  POST   /api/strategy/:id/stop            - 전략 중지
  GET    /api/strategy/:id/performance     - 전략 성과

Analytics:
  GET    /api/analytics/profit             - 수익률 통계
  GET    /api/analytics/trades             - 거래 분석
  GET    /api/analytics/performance        - 성과 리포트
```

#### 2. Frontend Dashboard
**위치**: `/frontend`

**주요 페이지**:
- **대시보드** (`/dashboard`):
  - 실시간 시세 차트 (Recharts)
  - 계좌 잔고 및 수익률
  - 최근 거래 내역
  - 활성 전략 현황

- **거래** (`/trading`):
  - 수동 매수/매도 주문
  - 호가창 및 체결 내역
  - 주문 관리 (취소/수정)

- **자동매매** (`/strategy`):
  - 전략 생성 및 설정
  - 백테스팅 결과
  - 전략 성과 모니터링
  - 전략 시작/중지

- **분석** (`/analytics`):
  - 수익률 차트 (일/주/월)
  - 거래 통계 및 패턴
  - 리스크 분석

#### 3. 데이터베이스 스키마

**Users Collection**:
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

**Trades Collection**:
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  symbol: String,           // e.g., "BTCUSDT"
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

**Strategies Collection**:
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

#### 4. 배포 환경

**Docker Compose 구성**:
```yaml
services:
  - backend: Node.js API Server (Port 5000)
  - frontend: React App (Port 3000)
  - mongodb: Database (Port 27017)
  - redis: Cache & Session Store (Port 6379)
```

**AWS 인프라** (deploy/aws-infrastructure.md 참조):
- Application Load Balancer
- ECS Fargate Cluster
- RDS for MongoDB
- ElastiCache for Redis
- S3 for Static Assets
- CloudWatch for Monitoring

#### 5. 문서

- **README.md**: 프로젝트 개요 및 설치 가이드
- **BMAD-PROJECT.md**: 프로젝트 전체 문서 (본 문서)
- **deploy/aws-infrastructure.md**: AWS 배포 가이드
- **API 문서**: (추가 예정) Swagger/OpenAPI 스펙

### 프로젝트 성과

#### 완료된 기능 (Sprint 1 + Phase 2)
✅ 사용자 인증 및 보안
✅ 실시간 시세 조회 및 WebSocket 스트리밍
✅ 수동 거래 (매수/매도)
✅ 자동매매 전략 엔진 (RSI, MACD, Bollinger Bands)
✅ 거래 히스토리 및 분석
✅ 수익률 추적 및 차트
✅ 알림 시스템

#### 다음 단계 (Phase 3)
🔄 멀티 거래소 지원
🔄 고급 백테스팅 시스템
🔄 포트폴리오 관리
🔄 AI/ML 예측 모델
🔄 소셜 트레이딩

### 리스크 및 대응

| 리스크 | 영향 | 확률 | 대응 방안 |
|--------|------|------|-----------|
| Bitget API 장애 | 높음 | 중간 | Circuit Breaker, Fallback 캐시 |
| 네트워크 지연 | 중간 | 높음 | WebSocket Reconnection, Timeout 설정 |
| 거래 손실 | 높음 | 중간 | 손절매 설정, 리스크 관리, 백테스팅 |
| 보안 침해 | 높음 | 낮음 | 암호화, Rate Limiting, 정기 보안 감사 |
| 스케일링 이슈 | 중간 | 낮음 | 수평 확장 (ECS Auto Scaling) |

---

## 📊 프로젝트 타임라인

```
2025-Q1: Sprint 1 - 기본 기능 ✅
  └─ 인증, 시세, 수동 거래

2025-Q2: Phase 2 - 고급 기능 ✅
  └─ WebSocket, 자동매매, 분석

2025-Q3: Phase 3 - 확장 기능 🔄
  └─ 멀티 거래소, 백테스팅

2025-Q4: Phase 4 - AI/ML 통합 📅
  └─ 예측 모델, 고급 분석
```

---

## 🔐 보안 및 규정 준수

- **데이터 암호화**: AES-256 (API 키), bcrypt (비밀번호)
- **통신 보안**: HTTPS/WSS
- **인증**: JWT (15분 만료 + Refresh Token)
- **접근 제어**: Role-based Access Control (RBAC)
- **감사 로그**: 모든 거래 및 API 호출 기록
- **규정 준수**: 개인정보보호법, 금융거래 관련 규정

---

## 📞 연락처 및 지원

- **Repository**: https://github.com/ockwonq/coin-trade
- **Issue Tracker**: GitHub Issues
- **Documentation**: /docs (추가 예정)

---

## 📝 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0.0 | 2025-11-17 | 초기 BMAD 문서 생성 | Claude |

---

**면책 조항**: 이 시스템은 실제 자금으로 거래합니다. 사용자는 투자 손실 위험을 충분히 이해하고 사용해야 합니다. 개발팀은 거래 손실에 대한 책임을 지지 않습니다.
