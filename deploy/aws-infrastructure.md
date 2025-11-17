# AWS 배포 가이드

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         Route 53                             │
│                    (도메인 관리)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   CloudFront (CDN)                           │
│              (정적 콘텐츠 캐싱 & SSL)                        │
└──────────┬─────────────────────────┬────────────────────────┘
           │                         │
    ┌──────▼──────┐          ┌──────▼──────────────┐
    │   S3 Bucket │          │  Application Load   │
    │  (Frontend) │          │    Balancer (ALB)   │
    └─────────────┘          └──────┬──────────────┘
                                    │
                             ┌──────▼──────────────┐
                             │   ECS Fargate       │
                             │   (Backend App)     │
                             └──────┬──────────────┘
                                    │
                             ┌──────▼──────────────┐
                             │   Amazon RDS        │
                             │   (MongoDB Atlas)   │
                             └─────────────────────┘
```

## 1. MongoDB Atlas 설정 (권장)

### 1.1 MongoDB Atlas 클러스터 생성
```bash
# MongoDB Atlas 콘솔에서:
1. 새 클러스터 생성 (M10 이상 권장)
2. AWS 리전 선택 (서울: ap-northeast-2)
3. 데이터베이스 사용자 생성
4. IP 화이트리스트 설정 (ECS 보안 그룹 추가)
5. 연결 문자열 복사
```

### 1.2 대안: Amazon DocumentDB
```bash
# DocumentDB는 MongoDB 호환 데이터베이스
aws docdb create-db-cluster \
  --db-cluster-identifier bitget-trading-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password YourPassword123
```

## 2. ECR (Elastic Container Registry) 설정

### 2.1 ECR 리포지토리 생성
```bash
# Backend 리포지토리
aws ecr create-repository \
  --repository-name bitget-trading/backend \
  --region ap-northeast-2

# Frontend 리포지토리 (선택사항)
aws ecr create-repository \
  --repository-name bitget-trading/frontend \
  --region ap-northeast-2
```

### 2.2 Docker 이미지 빌드 및 푸시
```bash
# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com

# Backend 이미지 빌드 및 푸시
cd backend
docker build -t bitget-trading/backend .
docker tag bitget-trading/backend:latest <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/bitget-trading/backend:latest
docker push <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/bitget-trading/backend:latest
```

## 3. ECS Fargate 설정

### 3.1 ECS 클러스터 생성
```bash
aws ecs create-cluster \
  --cluster-name bitget-trading-cluster \
  --region ap-northeast-2
```

### 3.2 태스크 정의 생성
`task-definition.json` 파일 생성 (예시는 아래 참조)

```bash
aws ecs register-task-definition \
  --cli-input-json file://deploy/task-definition.json
```

### 3.3 ECS 서비스 생성
```bash
aws ecs create-service \
  --cluster bitget-trading-cluster \
  --service-name bitget-trading-service \
  --task-definition bitget-trading-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=5000"
```

## 4. Application Load Balancer (ALB) 설정

### 4.1 ALB 생성
```bash
aws elbv2 create-load-balancer \
  --name bitget-trading-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx \
  --scheme internet-facing \
  --type application
```

### 4.2 타겟 그룹 생성
```bash
aws elbv2 create-target-group \
  --name bitget-trading-tg \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-xxx \
  --target-type ip \
  --health-check-path /health
```

## 5. S3 + CloudFront (Frontend)

### 5.1 S3 버킷 생성
```bash
aws s3 mb s3://bitget-trading-frontend --region ap-northeast-2

# 정적 웹사이트 호스팅 설정
aws s3 website s3://bitget-trading-frontend \
  --index-document index.html \
  --error-document index.html
```

### 5.2 Frontend 빌드 및 배포
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://bitget-trading-frontend --delete
```

### 5.3 CloudFront 배포 생성
```bash
aws cloudfront create-distribution \
  --origin-domain-name bitget-trading-frontend.s3.ap-northeast-2.amazonaws.com \
  --default-root-object index.html
```

## 6. 환경 변수 및 시크릿 관리 (AWS Secrets Manager)

### 6.1 시크릿 생성
```bash
aws secretsmanager create-secret \
  --name bitget-trading/env \
  --secret-string '{
    "MONGODB_URI": "mongodb+srv://...",
    "JWT_SECRET": "your-secret",
    "BITGET_API_KEY": "your-api-key",
    "BITGET_SECRET_KEY": "your-secret-key",
    "BITGET_PASSPHRASE": "your-passphrase"
  }' \
  --region ap-northeast-2
```

## 7. CI/CD 파이프라인 (GitHub Actions)

`.github/workflows/deploy.yml` 파일 참조

## 8. 모니터링 및 로깅

### 8.1 CloudWatch Logs
- ECS 태스크 로그 자동 수집
- 로그 그룹: `/ecs/bitget-trading-backend`

### 8.2 CloudWatch Alarms
```bash
# CPU 사용률 알람
aws cloudwatch put-metric-alarm \
  --alarm-name bitget-trading-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## 9. 보안 설정

### 9.1 보안 그룹
```bash
# ALB 보안 그룹: 80, 443 포트 개방
# ECS 보안 그룹: ALB에서만 5000 포트 허용
# RDS/DocumentDB 보안 그룹: ECS에서만 27017 포트 허용
```

### 9.2 IAM 역할
- ECS Task Execution Role
- ECS Task Role (Secrets Manager, CloudWatch Logs 권한)

## 10. 비용 최적화

### 10.1 Auto Scaling
```bash
# ECS 서비스 Auto Scaling 설정
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/bitget-trading-cluster/bitget-trading-service \
  --min-capacity 1 \
  --max-capacity 4
```

### 10.2 예상 비용 (월간, 서울 리전)
- ECS Fargate (2 vCPU, 4GB): ~$50-70
- Application Load Balancer: ~$20-30
- MongoDB Atlas (M10): ~$60
- S3 + CloudFront: ~$5-10
- 기타 (NAT Gateway, 데이터 전송 등): ~$20-30

**총 예상 비용: $155-200/월**

## 11. 배포 명령어 요약

```bash
# 1. 환경 변수 설정
cp .env.example .env
# .env 파일 수정 (API 키, MongoDB URI 등)

# 2. Docker 이미지 빌드 및 ECR 푸시
./deploy/build-and-push.sh

# 3. ECS 서비스 업데이트
aws ecs update-service \
  --cluster bitget-trading-cluster \
  --service bitget-trading-service \
  --force-new-deployment

# 4. Frontend 배포
cd frontend && npm run build
aws s3 sync dist/ s3://bitget-trading-frontend --delete
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

## 12. 트러블슈팅

### 12.1 ECS 태스크가 시작되지 않음
```bash
# 로그 확인
aws logs tail /ecs/bitget-trading-backend --follow

# 태스크 상태 확인
aws ecs describe-tasks --cluster bitget-trading-cluster --tasks <task-id>
```

### 12.2 MongoDB 연결 실패
- 보안 그룹 확인
- MongoDB Atlas IP 화이트리스트 확인
- 연결 문자열 확인

## 참고 자료
- [AWS ECS 공식 문서](https://docs.aws.amazon.com/ecs/)
- [MongoDB Atlas AWS 배포](https://docs.atlas.mongodb.com/reference/amazon-aws/)
- [CloudFront + S3 정적 호스팅](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html)
