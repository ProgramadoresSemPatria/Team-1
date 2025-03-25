from fastapi import FastAPI, Depends
from typing import Annotated

from sqlmodel import Session

from api.routers import auth, Users
from api.db import create_all_table_and_db, get_session

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

app.include_router(auth.router)
app.include_router(Users.router)

@app.on_event("startup")
def creating_on_startup():
    create_all_table_and_db()

@app.get("/")
def root():
    return {"Message": "Hello World!"}