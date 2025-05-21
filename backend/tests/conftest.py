import pytest_asyncio
from fastapi.testclient import TestClient
from app.main import app

@pytest_asyncio.fixture
async def async_client():
    client = TestClient(app)
    yield client

# Use this command for testing: pytest -v -rA --color=yes --tb=short
# Ctrl+Shift+P
