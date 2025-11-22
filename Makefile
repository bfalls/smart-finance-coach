.PHONY: dev test lint format

# Run the FastAPI app with auto-reload
dev:
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
