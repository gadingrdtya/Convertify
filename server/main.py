from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import convert, optimize, security, ai
from services.cleanup_service import cleanup_old_files

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    cleanup_old_files()
    yield
    # Shutdown

app = FastAPI(
    title="Convertify Backend Processing Engine",
    description="Microservice API for PDF and document manipulation with zero-knowledge ephemeral storage.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS enabled for Next.js client access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers per PRD contract
app.include_router(convert.router)
app.include_router(optimize.router)
app.include_router(security.router)
app.include_router(ai.router)

@app.get("/")
@app.get("/health")
def root():
    return {"status": "ok", "message": "Convertify Backend Worker Active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
