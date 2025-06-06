provider "aws" {
  region = "us-east-2"
}

# Security Group
resource "aws_security_group" "app_sg" {
  name        = "eldorado-backend-sg"
  description = "Security group for backend application"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Backend EC2 Instance
resource "aws_instance" "app_server" {
  ami           = "ami-058a8a5ab36292159"
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "eldorado-backend-server"
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "eldorado-rds-sg"
  description = "SG para acesso MySQL externo"

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Pode restringir ao IP da sua máquina para mais segurança
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# RDS MySQL Instance
resource "aws_db_instance" "mysql" {
  allocated_storage    = 20
  engine               = "mysql"
  identifier           = "eldoradodb"
  instance_class       = "db.t3.micro"
  engine_version       = "5.7"
  username             = "root"
  password             = "Eldorado2025"
  parameter_group_name = "default.mysql5.7"
  publicly_accessible  = true
  skip_final_snapshot  = true

  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  tags = {
    Name = "eldorado-rds"
  }
}

# S3 Bucket para frontend
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "eldorado-frontend-bucket"

  tags = {
    Name = "eldorado-frontend"
  }

  depends_on = [aws_instance.app_server]
}

# Desbloqueio de política pública
resource "aws_s3_bucket_public_access_block" "frontend_bucket_public_block" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Política pública para acessar o frontend
resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
      }
    ]
  })
}

# Configuração do S3 como site estático
resource "aws_s3_bucket_website_configuration" "frontend_bucket_website" {
  bucket = aws_s3_bucket.frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html" # Redireciona todas as rotas para o index.html para suportar SPA
  }
}

# Outputs
output "backend_public_ip" {
  value       = aws_instance.app_server.public_ip
  description = "IP público do backend"
}

output "frontend_s3_url" {
  value       = aws_s3_bucket_website_configuration.frontend_bucket_website.website_endpoint
  description = "URL do frontend no S3"
}

output "rds_endpoint" {
  value       = aws_db_instance.mysql.endpoint
  description = "Endpoint do banco de dados RDS"
}
