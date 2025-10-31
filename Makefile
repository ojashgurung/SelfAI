.PHONY: help up down logs clean restart build backend frontend widget db

# Default target
help:
	@echo "🚀 SelfAI Development Commands:"
	@echo ""
	@echo "  up        - Start all services with hot reload"
	@echo "  down      - Stop all services"
	@echo "  logs      - Show logs from all services"
	@echo "  restart   - Restart all services"
	@echo "  build     - Rebuild all Docker images"
	@echo "  clean     - Clean up containers and volumes"
	@echo ""
	@echo "  backend   - Show backend logs only"
	@echo "  frontend  - Show frontend logs only"
	@echo "  widget    - Show widget app logs only"
	@echo "  db        - Access PostgreSQL database"
	@echo ""

# Start all services
up:
	@echo "🚀 Starting SelfAI development environment..."
	docker compose up -d
	@echo "✅ Services started!"
	@echo ""
	@echo "🌐 Access your applications:"
	@echo "   Frontend:   http://localhost:3000"
	@echo "   Widget App: http://localhost:3001"
	@echo "   Backend:    http://localhost:8000"
	@echo ""
	@echo "📝 View logs with: make logs"

# Stop all services
down:
	@echo "🛑 Stopping all services..."
	docker compose down
	@echo "✅ All services stopped!"

# Show logs from all services
logs:
	docker compose logs -f

# Restart all services
restart: down up

# Build all images
build:
	@echo "🔨 Building Docker images..."
	docker compose build --no-cache
	@echo "✅ Build complete!"

# Clean everything
clean:
	@echo "🧹 Cleaning up..."
	docker compose down -v --rmi local --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup complete!"

# Individual service logs
backend:
	docker compose logs -f backend

frontend:
	docker compose logs -f frontend

widget:
	docker compose logs -f widget-app

# Database access
db:
	docker compose exec postgres psql -U selfai selfai_dev

# Database access from host (using external port)
db-host:
	psql -h localhost -p 5433 -U selfai -d selfai_dev

# Check service status
status:
	docker compose ps