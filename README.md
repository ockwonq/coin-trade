# Bitget 암호화폐 거래 시스템

Bitget 거래소 API를 활용한 암호화폐 자동/수동 거래 시스템

## 🏗️ 기술 스택

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Bitget API SDK
- JWT 인증
- WebSocket (실시간 데이터)

### Frontend
- React + Vite
- Axios (API 통신)
- Recharts (차트)
- TailwindCSS

### Deployment
- Docker & Docker Compose
- AWS (EC2/ECS + RDS + S3)

## 📦 프로젝트 구조

```
coin-trade/
├── backend/          # Node.js + Express 백엔드
│   ├── src/
│   │   ├── controllers/   # API 컨트롤러
│   │   ├── models/        # MongoDB 모델
│   │   ├── routes/        # API 라우트
│   │   ├── services/      # 비즈니스 로직
│   │   ├── middleware/    # 미들웨어
│   │   ├── config/        # 설정 파일
│   │   └── utils/         # 유틸리티
│   └── tests/
├── frontend/         # React 프론트엔드
│   ├── src/
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── services/      # API 서비스
│   │   ├── hooks/         # 커스텀 훅
│   │   └── contexts/      # Context API
│   └── public/
└── docker-compose.yml
```

## 🚀 기능

### Sprint 1 (기본 기능)
- ✅ 사용자 인증 (회원가입/로그인)
- ✅ 실시간 시세 조회
- ✅ 잔고 조회
- ✅ 매수/매도 주문
- ✅ 주문 내역 조회

### Phase 2 (고급 기능)
- ✅ WebSocket 실시간 시세 스트리밍
- ✅ 자동매매 전략 엔진
  - RSI, MACD, Bollinger Bands 기반 전략
  - 커스텀 전략 설정
- ✅ 거래 히스토리 분석
- ✅ 수익률 차트 및 통계
- ✅ 알림 시스템

## 🔧 설치 및 실행

### 환경 변수 설정
```bash
# backend/.env
cp backend/.env.example backend/.env
# Bitget API 키 입력 필요
```

### Docker로 실행
```bash
docker-compose up -d
```

### 로컬 개발
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📡 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 거래
- `GET /api/market/ticker/:symbol` - 시세 조회
- `GET /api/account/balance` - 잔고 조회
- `POST /api/trade/order` - 주문 생성
- `GET /api/trade/orders` - 주문 내역

### 자동매매 (Phase 2)
- `POST /api/strategy/create` - 전략 생성
- `POST /api/strategy/:id/start` - 전략 시작
- `POST /api/strategy/:id/stop` - 전략 중지

## 🔐 보안

- JWT 토큰 기반 인증
- API 키 암호화 저장
- Rate limiting
- CORS 설정

## 📊 모니터링

- 거래 로그
- 수익률 추적
- 에러 로깅

## ⚠️ 주의사항

이 시스템은 실제 자금으로 거래합니다. 반드시:
1. 테스트넷에서 충분히 테스트
2. 소액으로 시작
3. 손절매 설정
4. API 키 보안 관리

## 📝 라이센스

MIT
