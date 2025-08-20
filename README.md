# mono-multi-trigger-russel

A demonstration monorepo with 5 microservices designed to showcase GitHub Actions workflows and multi-service orchestration.

## Overview

This project demonstrates a monorepo architecture with multiple microservices (service-a through service-e) and automated workflows for testing and deployment. It uses npm workspaces to manage dependencies and scripts across all services.

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 7 or higher for workspace support)
- Git

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/octodemo/mono-multi-trigger-russel.git
   cd mono-multi-trigger-russel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create the services structure** (if not already present):
   ```bash
   mkdir -p services/{service-a,service-b,service-c,service-d,service-e}
   ```

   Each service should contain its own `package.json` with appropriate scripts for `start` and `test`.

## Execution Instructions

### Running All Services

**Run tests for all services:**
```bash
npm test
```

**Run individual service tests:**
```bash
npm run test:service-a
npm run test:service-b
npm run test:service-c
npm run test:service-d
npm run test:service-e
```

**Start individual services:**
```bash
npm run start:service-a
npm run start:service-b
npm run start:service-c
npm run start:service-d
npm run start:service-e
```

### Available Scripts

- `npm test` - Run tests for all services in the workspace
- `npm run test:service-{a|b|c|d|e}` - Run tests for a specific service
- `npm run start:service-{a|b|c|d|e}` - Start a specific service

## Repository Structure

```
mono-multi-trigger-russel/
├── services/
│   ├── service-a/
│   ├── service-b/
│   ├── service-c/
│   ├── service-d/
│   └── service-e/
├── .github/
│   └── workflows/
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## GitHub Actions Integration

This repository is designed to work with GitHub Actions workflows that can:
- Trigger builds and tests for individual services based on file changes
- Run multi-service integration tests
- Deploy services independently or as a coordinated release

The workflows should be placed in `.github/workflows/` directory and can utilize the npm scripts defined in this root `package.json` to execute service-specific operations.

## Development Workflow

1. Make changes to one or more services in the `services/` directory
2. Run tests locally: `npm test` or `npm run test:service-a` for specific services
3. Start services locally for testing: `npm run start:service-a`
4. Commit changes - GitHub Actions will automatically trigger appropriate workflows
5. Monitor the GitHub Actions tab for build and deployment status