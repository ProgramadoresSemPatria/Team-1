from fastapi import FastAPI

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

@app.get("/")
def root():
    return {"Message": "Hello World!"}