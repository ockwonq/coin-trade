#!/bin/bash

# AWS ECR에 Docker 이미지 빌드 및 푸시
# 사용법: ./deploy/build-and-push.sh <AWS_ACCOUNT_ID> <AWS_REGION>

set -e

AWS_ACCOUNT_ID=${1:-"123456789012"}
AWS_REGION=${2:-"ap-northeast-2"}
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "🔐 ECR 로그인 중..."
aws ecr get-login-password --region ${AWS_REGION} | \
  docker login --username AWS --password-stdin ${ECR_REGISTRY}

echo "🏗️  Backend 이미지 빌드 중..."
cd backend
docker build -t bitget-trading/backend:latest .
docker tag bitget-trading/backend:latest ${ECR_REGISTRY}/bitget-trading/backend:latest
docker tag bitget-trading/backend:latest ${ECR_REGISTRY}/bitget-trading/backend:$(git rev-parse --short HEAD)

echo "📤 Backend 이미지 푸시 중..."
docker push ${ECR_REGISTRY}/bitget-trading/backend:latest
docker push ${ECR_REGISTRY}/bitget-trading/backend:$(git rev-parse --short HEAD)

cd ..

echo "✅ 배포 완료!"
echo "📝 ECS 서비스 업데이트:"
echo "aws ecs update-service --cluster bitget-trading-cluster --service bitget-trading-service --force-new-deployment"
