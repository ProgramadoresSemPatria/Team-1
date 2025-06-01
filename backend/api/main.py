from fastapi import FastAPI, Depends, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Annotated
from sqlmodel import Session
import os
import uvicorn

from api.routers import auth, Users, Search
from api.db import create_all_table_and_db, get_session
from api.utils.token import decode_token, protected_endpoint
from api.utils.create_admin import create_admin
from api.utils.exception_handler import create_error_response, ERROR_CODES, handle_exception
from api.routers import news

description = """
# Feed AI

API developed for analyzing user feedback using AI. The system can process CSV files containing feedback 
and categorize the sentiment of each entry. The API provides authentication mechanisms, user management, 
and feedback analysis capabilities.
"""

app = FastAPI(
    title="Feed AI API",
    summary="Feed AI is a SaaS to get feedback with AI for your brand",
    description=description,
    version="1.0.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "<name here>",
        "email": "email@gmail.com"
    },
    license_info={
        "name": "MIT",
        "identifier": "MIT",
    }
)

# Global exception handler middleware
@app.middleware("http")
async def global_exception_handler(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        try:
            # Try to use our structured exception handler
            handle_exception(e)
        except HTTPException as http_exc:
            # Return the HTTPException raised by handle_exception
            return JSONResponse(
                status_code=http_exc.status_code,
                content=http_exc.detail
            )
        except Exception as unexpected_error:
            # Last resort for truly unexpected errors
            error_response = create_error_response(
                500,
                ERROR_CODES["INTERNAL_ERROR"],
                "An unexpected error occurred"
            )
            return JSONResponse(
                status_code=500,
                content=error_response
            )

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(Users.router, prefix="/api")
app.include_router(Search.router, prefix="/api")
app.include_router(news.router, prefix="/api")

@app.on_event("startup")
def creating_on_startup():
    """Initialize database and create admin user on startup."""
    create_all_table_and_db()
    create_admin()

@app.get("/api", summary="API Root", description="Verifies that API is running and authentication is working")
def root(token: Annotated[str, Depends(protected_endpoint)]):
    return {"message": "Hello World!"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)