# 🚀 SelfAI Development Setup

Quick setup guide for running SelfAI in development mode with hot reload.

## Prerequisites

- Docker Desktop installed and running
- At least 4GB RAM available
- Ports 3000, 3001, 8000, 5432, 6379 available

## Quick Start

### 1. Setup Environment

```bash
# Navigate to project directory
cd /Users/ojashgurung/Documents/Coding/Projects/SelfAI

# The .env file is already created with development defaults
# Add your OpenAI API key:
nano .env
# Set: OPENAI_API_KEY=your-actual-api-key
```

### 2. Start Development Environment

```bash
# Start everything with hot reload
make up

# Or using docker-compose directly
docker-compose up -d
```

### 3. Access Your Applications

- **Frontend**: http://localhost:3000 (Next.js with hot reload)
- **Widget App**: http://localhost:3001 (Next.js with hot reload)  
- **Backend API**: http://localhost:8000 (FastAPI with hot reload)

## Development Features

✅ **Hot Reload**: All services automatically reload on code changes
✅ **Volume Mounting**: Your local code is mounted into containers
✅ **Fast Startup**: Optimized for development workflow
✅ **Easy Logs**: Simple commands to view service logs

## Useful Commands

```bash
# View all logs
make logs

# View specific service logs
make backend    # Backend API logs
make frontend   # Frontend logs
make widget     # Widget app logs

# Restart everything
make restart

# Stop services
make down

# Access database
make db

# Check status
make status

# Clean up everything
make clean
```

## Development Workflow

1. **Make code changes** in your editor
2. **See changes instantly** - hot reload handles the rest
3. **Check logs** if needed: `make logs`
4. **Database access** if needed: `make db`

## File Structure

Your code changes in these directories will trigger hot reload: