.PHONY: dev test lint format dev-openai openai-smoke chat-smoke

LOCAL_IP := $(shell ifconfig | awk '/inet / && $$2 !~ /127\.0\.0\.1/ {print $$2; exit}')
OPENAI_MODEL ?= gpt-4.1-mini

# Run the FastAPI app with auto-reload
dev:
	FRONTEND_ORIGIN="http://localhost:5173,http://$(LOCAL_IP):5173" \
	uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

dev-openai:
	@echo "Starting FastAPI with REAL OpenAI provider..."
	@set -a; \
	[ -f .env.openai ] && . .env.openai || (echo '❌ .env.openai missing'; exit 1); \
	set +a; \
	FRONTEND_ORIGIN="http://localhost:5173,http://$(LOCAL_IP):5173" \
	uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Run the test suite
test:
	pytest

# Static analysis with Ruff
lint:
	ruff check backend tests

# Format code with Ruff and Black
format:
	ruff format backend tests
	black backend tests

openai-smoke:
	@set -a; \
	[ -f .env ] && . .env || echo 'No .env found'; \
	set +a; \
	echo "Running OpenAI smoke test..."; \
	AI_PROVIDER=openai AI_MODEL=$(OPENAI_MODEL) python scripts/openai_smoke.py

chat-smoke:
	@echo "Running mock chat smoke test..."
	@AI_PROVIDER=mock uvicorn backend.main:app --host 0.0.0.0 --port 8000 & \
	api_pid=$$!; \
	sleep 2; \
	python scripts/mock_smoke.py; \
	kill $$api_pid >/dev/null 2>&1 || true
