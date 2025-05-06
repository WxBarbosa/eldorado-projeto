# Eldorado Projeto

Technical challenge AWS

## Getting Started

This project can be executed in two scenarios: locally for development and deployed to AWS using Terraform. Follow the appropriate instructions for your needs.

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (recommended version: 16.x or later)
2. Install [Angular CLI](https://angular.io/cli) globally:
   ```bash
   npm install -g @angular/cli
   ```
3. Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
4. Install [Terraform](https://www.terraform.io/downloads) (only needed for AWS deployment)
5. Configure AWS CLI with your credentials (only needed for AWS deployment)

## Scenario 1: Local Development

### 1. Database Setup
1. Make sure you have Docker running
2. From the root directory, start the MySQL container:
   ```bash
   docker-compose up mysql -d
   ```

### 2. Backend Setup
1. Navigate to `backend` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=Eldorado2025
   DB_NAME=eldorado_db
   ```
4. Run migrations:
   ```bash
   node migrations/migrate.js
   ```
5. Start the backend:
   ```bash
   npm start
   ```
   The API will be available at http://localhost:3000

### 3. Frontend Setup
1. Navigate to `frontend` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Angular development server:
   ```bash
   ng serve
   ```
   The application will be available at http://localhost:4200

## Scenario 2: AWS Deployment with Terraform

### 1. Infrastructure Deployment
1. Navigate to `backend` directory
2. Initialize Terraform:
   ```bash
   terraform init
   ```
3. Deploy the infrastructure:
   ```bash
   terraform apply
   ```
4. After deployment, Terraform will output:
   - Frontend URL (S3 bucket website endpoint)
   - Backend URL (EC2 instance public IP)
   - RDS endpoint

### 2. Database Setup
1. Connect to the RDS instance using the endpoint from Terraform output:
   ```bash
   mysql -h <RDS_ENDPOINT> -u root -pEldorado2025
   ```
2. Create the database:
   ```sql
   CREATE DATABASE eldoradodb;
   ```

### 3. Backend Setup on EC2
1. Connect to the EC2 instance using SSH:
   ```bash
   ssh -i <YOUR_KEY_PAIR>.pem ec2-user@<EC2_PUBLIC_IP>
   ```

2. Install required packages:
   ```bash
   sudo yum update -y
   sudo yum install -y git nodejs npm
   ```

3. Install PM2 globally:
   ```bash
   sudo npm install -g pm2
   ```

4. Clone the repository:
   ```bash
   cd /home/ec2-user
   git clone https://github.com/wxbarbosa/eldorado-projeto.git
   cd eldorado-projeto/backend
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

6. Create the .env file:
   ```bash
   cat > .env << EOL
   DB_HOST=<RDS_ENDPOINT>
   DB_USER=root
   DB_PASS=Eldorado2025
   DB_NAME=eldoradodb
   EOL
   ```

7. Run database migrations:
   ```bash
   node migrations/migrate.js
   ```

8. Start the backend server with PM2:
   ```bash
   pm2 start bin/www --name "eldorado-api"
   ```

9. Configure PM2 to start on system boot:
   ```bash
   pm2 startup
   pm2 save
   ```

10. Useful PM2 commands:
    - Check application status: `pm2 status`
    - View logs: `pm2 logs eldorado-api`
    - Restart application: `pm2 restart eldorado-api`
    - Stop application: `pm2 stop eldorado-api`

### 4. Frontend Deployment
1. Navigate to `frontend` directory
2. Install npm modules:
    ```bash
    npm install
    ```
3. Build the frontend, update environment url and deploy bucket frontend:
   ```bash
   npm run deploy:aws
   ```
   The build will be automatically uploaded to the S3 bucket configured by Terraform

### Testing the Deployment
1. Access your frontend through the S3 bucket website URL
2. The backend API will be available at `http://<EC2_PUBLIC_IP>:3000`
3. The database will be accessible at the RDS endpoint

### Notes
- For local development, make sure Docker is running before starting the services
- For AWS deployment, ensure you have proper AWS credentials configured
- The database will be automatically created during the Terraform deployment
- Frontend environment configuration needs to be updated with the correct backend URL after deployment
