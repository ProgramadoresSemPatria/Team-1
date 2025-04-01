# FeedAI - Backend

Welcome to the backend repository for **FeedAI**. This backend powers the FeedAI SaaS application.

## Introduction

FeedAI is a Software as a Service (SaaS) designed to streamline the process of analyzing user feedback. This backend service handles data management, user authentication, and the core logic for automatically classifying feedback sentiment using Machine Learning models. Its primary goal is to provide valuable insights from user comments in seconds, transforming a potentially hours-long task into an efficient process.

The backend is built using **FastAPI**, leveraging Starlette for asynchronous web capabilities and Pydantic for robust data validation. Database interactions and modeling are handled by **SQLModel**, which combines the strengths of Pydantic and SQLAlchemy.

The service, including the **PostgreSQL** database, is deployed on **Render**, ensuring high availability and scalability.

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
  - [Using Uvicorn (Development)](#using-uvicorn-development)
  - [Using Docker](#using-docker)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)  
- [Author](#author)

## Key Features 
###### [↑ TOP](#introduction)

-   **User Authentication:** Secure login system using JWT tokens (OAuth2 compatible).
-   **User Management:** Full CRUD operations for users, including role-based access control (Admin permissions).
-   **Feedback Ingestion:** Accepts feedback data via CSV or XLSX file uploads.
-   **Automated Sentiment Analysis:** Integrates Machine Learning models to automatically classify the sentiment of submitted feedback.
-   **Data Tagging:** Automatically tags feedback submissions based on input source (e.g., filename).
-   **Insight Retrieval & Filtering:** Provides powerful querying capabilities:
    -   Retrieve distinct tags.
    * Group sentiment counts by tag.
    * Filter feedback data by date range, tag, sentiment, and pagination.
-   **Data Management:** Allows deletion of feedback insights based on tags.

## Technologies Used
###### [↑ TOP](#introduction)

-   **Framework:** FastAPI
-   **Web / Data Validation:** Starlette / Pydantic
-   **Database ORM/Modeling:** SQLModel (built on Pydantic & SQLAlchemy)
-   **Database:** PostgreSQL
-   **Authentication:** JWT (JSON Web Tokens), Python-jose, Passlib (for hashing)
-   **Containerization:** Docker, Docker Compose
-   **Language:** Python 3.x
-   **ML Models:** Custom models (details in `ml_model/`)

## Project Structure
###### [↑ TOP](#introduction)

The backend codebase is organized as follows:

```
backend/
├── api/                        # Core API logic
│   ├── db/                     # Database configuration and models
│   │   ├── __init__.py         # Makes "db" a "Python subpackage"
│   │   ├── AIResponse.py       # Model for feedback/sentiment results
│   │   ├── AIResponseTags.py   # Model for tags associated with feedback
│   │   └── Users.py            # User model
│   ├── enum/                   # Enumerations used in the project
│   │   ├── __init__.py         # Makes "enum" a "Python subpackage"
│   │   ├── DateOperator.py  
│   │   └── TagsEnum.py  
│   ├── routers/                # API route definitions
│   │   ├── __init__.py         # Makes "routers" a "Python subpackage"
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── Search.py           # Feedback/Insight endpoints
│   │   └── Users.py            # User management endpoints
│   ├── utils/                  # Helper functions and utilities
│   │   ├── __init__.py         # Makes "utils" a "Python subpackage"
│   │   ├── create_admin.py     # Script/util to create admin user
│   │   ├── operators.py        # Filter operators
│   │   ├── query_helper.py     # DB Query assistance functions
│   │   ├── response_helper.py  # API Response formatting helpers
│   │   └── token.py            # JWT token generation/validation
│   └── main.py                 # FastAPI application entry point
├── __init.py__                 # This file makes "api" a "Python package"
├── ml_model/                   # Machine Learning models and related code
├── .env.sample                 # Example environment variables file
├── docker-compose.yaml         # Docker Compose configuration
└── requirements.txt            # Python package dependencies
```


## API Endpoints
###### [↑ TOP](#introduction)

All backend routes are prefixed with `/api`.

### Authentication (`/auth`)

-   **`POST /login/swagger`**: Login via Swagger UI docs (uses `OAuth2PasswordRequestForm`). Returns JWT access token.
-   **`POST /login`**: Login from other clients (expects username/password in body). Returns JWT access token.

### Users (`/users`)

-   **`POST /`**: Create a new user.
-   **`PATCH /`**: Update the currently logged-in user's details. (Requires authentication)
-   **`DELETE /admin/{user_id}`**: Delete a specific user by ID. (Requires ADMIN privileges)
-   **`GET /`**: Get a list of all usernames. (Requires authentication)
-   **`GET /admin`**: Get detailed information for all users. (Requires ADMIN privileges)
-   **`GET /admin/{user_id}`**: Get detailed information for a specific user by ID. (Requires ADMIN privileges)
-   **`GET /me`**: Get the details of the currently logged-in user. (Requires authentication)

### Search / Insights (`/search`)

(All routes require authentication)

-   **`POST /input`**: Upload a CSV or XLSX file containing feedback. Triggers sentiment analysis and stores results with an associated tag.
-   **`GET /input/group`**: Get counts of each sentiment type, grouped by tag (input source).
-   **`GET /input/distinct_tag`**: Get a list of unique tags (input sources) associated with the user's data.
-   **`POST /input/filter`**: Retrieve feedback entries with filtering options (pagination, date range, tag, sentiment). All filters are optional.
-   **`DELETE /input/delete`**: Delete all feedback entries associated with a specific tag.

## Getting Started
###### [↑ TOP](#introduction)

Follow these instructions to set up and run the backend service locally.

### Prerequisites

-   Python 3.8+
-   `pip` (Python package installer)
-   Git
-   Docker and Docker Compose (Optional, for running with containers)
-   Access to a PostgreSQL database instance (local or remote)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ProgramadoresSemPatria/Team-1.git
    cd .\Team-1\
    cd .\backend\
    ```

2.  **Create and activate a virtual environment** (Recommended):
    ```bash
    python -m venv venv
    # On Windows
    .\venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

### Environment Variables

1.  Copy the example environment file:
    ```bash
    cp .env.sample .env
    ```
2.  Edit the `.env` file and provide the necessary values, especially for:
    * `SECRET_KEY`: A strong secret key for JWT encoding.
    * `ALGORITHM`: The algorithm for JWT (e.g., `HS256`).
    * `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgresql://user:password@host:port/database`) 
    * `ADMIN_PASSWORD`: Your default admin password.
    * `PORT`: PORT to run server

## Running the Application 
###### [↑ TOP](#introduction)

### Using Uvicorn (Development)

This runs the FastAPI development server with auto-reload.

```bash
uvicorn api.main:app --reload
```

The API will be accessible at `http://localhost:8000`, and the interactive Swagger documentation at `http://localhost:8000/docs`.

### Using Docker

Ensure Docker and Docker Compose are installed and running.

1.  **Build and start the services**:
    ```bash
    docker-compose up --build
    ```
    (Use `docker-compose up -d` to run in detached mode)

2.  **Stop the services**:
    ```bash
    docker-compose down
    ```

The API will typically be accessible at the same address (`http://localhost:8000`) unless ports are mapped differently in `docker-compose.yaml`.

## Deployment
###### [↑ TOP](#introduction)

The production version of this backend service is deployed on **Render**.

[API-Deploy](https://teamonehackaton.onrender.com/docs)

## Contributing
###### [↑ TOP](#introduction)

Contributions are welcome! If you find any bugs or have feature requests, please open an issue on the project's GitHub repository.

[GitHub Issues](https://github.com/ProgramadoresSemPatria/Team-1/issues)

## License
###### [↑ TOP](#introduction)

This project is licensed under the MIT License.

## Author
###### [↑ TOP](#introduction)

**Made by [Team 1 - Gabriel Melo, João Vitor, Lucas Marciano e Pedro Oliveira]**

[Gabriel Melo](https://github.com/gbnunes7)

[João Vitor](https://github.com/araujojv)

[Lucas Marciano](https://github.com/Lucas-I-Marciano) 

[Pedro Oliveira](https://github.com/pedrogagodev)

