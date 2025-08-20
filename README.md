# Monorepo Multi-Service Deployment Demo

This repository demonstrates a monorepo setup with 5 microservices and GitHub Actions workflows that provide granular, manual control over testing and deployment to multiple environments.

## 🏗️ Architecture Overview

This monorepo contains 5 microservices:

- **Service A - User Management** (`services/service-a`) - Handles user registration, authentication, and profile management
- **Service B - Product Catalog** (`services/service-b`) - Manages product inventory and catalog
- **Service C - Order Management** (`services/service-c`) - Processes and tracks customer orders
- **Service D - Payment Service** (`services/service-d`) - Handles payment processing and refunds
- **Service E - Notification Service** (`services/service-e`) - Manages email, SMS, and push notifications

## 🚀 Features

### ✅ Automated Testing
- **Comprehensive Test Suite**: Each service has its own unit tests
- **CI/CD Integration**: Tests run automatically on push/PR
- **Multi-Node Testing**: Tests run on Node.js 18.x and 20.x

### 🎯 Granular Deployment Control
- **Manual Deployment Triggers**: Choose exactly which services to deploy
- **Multi-Environment Support**: Deploy to 5 different environments (dev, staging, test1, test2, prod)
- **Selective Service Deployment**: Deploy one, some, or all services as needed
- **Dry Run Support**: Test deployment workflows without actual deployment

### 🔍 Change Detection
- **Path-based Filtering**: Automatically detect which services have changed
- **Optimized Testing**: Only run tests for services that have been modified

## 📁 Project Structure

```
mono-multi-trigger-russel/
├── .github/workflows/           # GitHub Actions workflows
│   ├── test-all.yml            # Automated testing workflow
│   └── deploy-manual.yml       # Manual deployment workflow
├── services/                    # Microservices directory
│   ├── service-a/              # User Management Service
│   │   ├── src/index.js
│   │   ├── __tests__/
│   │   └── package.json
│   ├── service-b/              # Product Catalog Service
│   ├── service-c/              # Order Management Service
│   ├── service-d/              # Payment Service
│   └── service-e/              # Notification Service
├── package.json                # Root package.json with workspace config
└── README.md                   # This file
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/octodemo/mono-multi-trigger-russel.git
cd mono-multi-trigger-russel
```

2. Install dependencies:
```bash
npm install
```

3. Run all tests:
```bash
npm test
```

4. Run tests for a specific service:
```bash
npm run test:service-a  # or service-b, service-c, service-d, service-e
```

5. Start a specific service:
```bash
npm run start:service-a  # Starts on port 3001
npm run start:service-b  # Starts on port 3002
npm run start:service-c  # Starts on port 3003
npm run start:service-d  # Starts on port 3004
npm run start:service-e  # Starts on port 3005
```

## 🔄 Workflows

### 1. Automated Testing (`test-all.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**
- Runs all tests across all services
- Tests on multiple Node.js versions (18.x, 20.x)
- Detects which services have changed using path filters
- Provides detailed test results

### 2. Manual Deployment (`deploy-manual.yml`)

**Trigger:** Manual workflow dispatch from GitHub Actions UI

**Inputs:**
- **Services**: Comma-separated list of services to deploy (e.g., `service-a,service-c`)
- **Environment**: Target environment (`dev`, `staging`, `test1`, `test2`, `prod`)
- **Version**: Version/tag to deploy (default: `latest`)
- **Dry Run**: Whether to perform a dry run without actual deployment

**What it does:**
1. Validates input services against available services
2. Runs full test suite to ensure code quality
3. Deploys selected services to chosen environment in parallel
4. Performs health checks and verification
5. Provides comprehensive deployment summary

## 🎮 How to Use Manual Deployment

1. Go to the **Actions** tab in GitHub
2. Select **Manual Deployment** workflow
3. Click **Run workflow**
4. Configure your deployment:
   - **Services**: Choose which services to deploy (e.g., `service-a,service-b`)
   - **Environment**: Select target environment
   - **Version**: Specify version (optional)
   - **Dry Run**: Check for testing without actual deployment
5. Click **Run workflow**

### Example Deployment Scenarios

**Deploy all services to development:**
- Services: `service-a,service-b,service-c,service-d,service-e`
- Environment: `dev`

**Deploy only user and payment services to staging:**
- Services: `service-a,service-d`
- Environment: `staging`

**Test deployment workflow (dry run):**
- Services: `service-c`
- Environment: `test1`
- Dry Run: ✅ (checked)

## 🌐 Service APIs

### Service A - User Management (Port 3001)
- `GET /health` - Health check
- `GET /users` - List all users
- `GET /users/:id` - Get specific user
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Service B - Product Catalog (Port 3002)
- `GET /health` - Health check
- `GET /products` - List products (supports `?category=` filter)
- `GET /products/:id` - Get specific product
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Service C - Order Management (Port 3003)
- `GET /health` - Health check
- `GET /orders` - List orders (supports `?userId=` and `?status=` filters)
- `GET /orders/:id` - Get specific order
- `POST /orders` - Create new order
- `PUT /orders/:id/status` - Update order status

### Service D - Payment Service (Port 3004)
- `GET /health` - Health check
- `GET /payments` - List payments (supports `?orderId=` and `?status=` filters)
- `GET /payments/:id` - Get specific payment
- `POST /payments` - Process new payment
- `POST /payments/:id/refund` - Process refund

### Service E - Notification Service (Port 3005)
- `GET /health` - Health check
- `GET /notifications` - List notifications (supports filters)
- `GET /notifications/:id` - Get specific notification
- `POST /notifications` - Create notification
- `POST /notifications/:id/send` - Send notification
- `GET /notifications/stats/summary` - Get notification statistics

## 🧪 Testing

Each service includes comprehensive unit tests covering:
- Health endpoints
- CRUD operations
- Error handling
- Input validation
- Business logic

Run tests using:
```bash
# All services
npm test

# Individual services
npm run test:service-a
npm run test:service-b
npm run test:service-c
npm run test:service-d
npm run test:service-e
```

## 🚀 Deployment Environments

The system supports deployment to 5 different environments:

- **dev** - Development environment for feature testing
- **staging** - Pre-production environment for integration testing
- **test1** - First test environment for QA
- **test2** - Second test environment for performance testing
- **prod** - Production environment

Each environment can be configured with different:
- Resource limits
- Environment variables
- Database connections
- External service endpoints

## 🔧 Configuration

### Environment Variables

Each service can be configured using environment variables:

- `PORT` - Service port (defaults: 3001-3005)
- `NODE_ENV` - Environment mode (development/production)
- `LOG_LEVEL` - Logging level
- Service-specific configuration variables

### Workspace Configuration

The project uses npm workspaces for efficient dependency management:
- Shared dependencies in root `package.json`
- Service-specific dependencies in individual `package.json` files
- Unified scripts for testing and starting services

## 📊 Monitoring & Observability

Each service provides:
- Health check endpoints (`/health`)
- Structured logging
- Basic metrics and statistics
- Error tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Demo Features Demonstrated:**
✅ Monorepo with 5 microservices  
✅ Unit tests for all services  
✅ Automated testing on code changes  
✅ Manual deployment control  
✅ Granular service selection  
✅ Multi-environment support  
✅ Parallel deployment capabilities  
✅ Dry run functionality  
✅ Change detection and path filtering

lalalalala
