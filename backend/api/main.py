from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from sqlmodel import Session

from api.routers import auth, Users, Search
from api.db import create_all_table_and_db, get_session
from api.utils.token import decode_token, protected_endpoint
from api.utils.create_admin import create_admin
import uvicorn

description = """
# Feed AI

API developed to ......
"""

app = FastAPI(
    title="Feed AI API",
    summary="Feed AI is a SaaS to get feedback with AI to your brand",
    description=description,
    version="1.0.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "<name here>",
        "email": "email@gmail.com"
    },
    license_info={
        "name": "Apache 2.0",
        "identifier": "MIT",
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(Users.router, prefix="/api")
app.include_router(Search.router, prefix="/api")

@app.on_event("startup")
def creating_on_startup():
    create_all_table_and_db()
    create_admin()

@app.get("/api")
def root(token: Annotated[protected_endpoint, Depends()]):
    return {"Message": "Hello World!"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)