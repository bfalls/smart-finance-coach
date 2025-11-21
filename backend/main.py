import os
from typing import List

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.health import router as health_router


def get_allowed_origins() -> List[str]:
    frontend_origin = os.getenv("FRONTEND_ORIGIN")
    origins = [frontend_origin] if frontend_origin else []
    default_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    return origins or default_origins


def create_app() -> FastAPI:
    app = FastAPI(title="Smart Finance Coach API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_allowed_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)

    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
