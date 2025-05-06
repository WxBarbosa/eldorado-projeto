#!/bin/bash

# Obter os outputs do Terraform
BACKEND_IP=$(terraform output -raw backend_public_ip)
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
FRONTEND_URL=$(terraform output -raw frontend_s3_url)

# Atualizar o arquivo .env do backend
echo "DB_HOST=$RDS_ENDPOINT" > ../backend/.env
echo "DB_USER=root" >> ../backend/.env
echo "DB_PASSWORD=example" >> ../backend/.env
echo "DB_NAME=eldorado" >> ../backend/.env
echo "BACKEND_URL=http://$BACKEND_IP" >> ../backend/.env

echo "Arquivo .env do backend atualizado com sucesso."

# Exibir o URL do frontend
echo "O frontend está disponível em: $FRONTEND_URL"