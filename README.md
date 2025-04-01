# FeedAI

Welcome to my repository for **Team-1/FeedAI**. 

## Introduction

It is a website where you will import a .csv file with feedback from your customers and our trained AI model will perform an analysis showing metrics of positive, neutral and negative feedbacks.

Created to participate in the Borderless Coding Hackathon

The PostgreSQL database is securely deployed on **Render**, ensuring high availability and scalability.

If you want to test, please use the CSV templates that are in this repository.

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Deployed Version](#deployed-version)
- [What's Coming Up](#whats-coming-up)
- [Conclusion](#conclusion)

## Key Features

- **Csv Import** 
- **Csv Analysis** 
- **Data Metrics**
## Technologies Used

**Back-end:**

- **PostgreSQL** 
- **Fast API**
- **Python3** 

**Front-end:**

- **React** 
- **Axios**
- **TypeScript** 
- **Framer Motion** 
- **Shadcn** 
- **Context API** 
- **Tailwind CSS**
- **Zustand**
- **React Query**

## Installation

Before you start, ensure you have `node`, `npm`, `docker` and `python` installed on your machine. 

**Clone the repository**:
   
   ```bash
   git clone https://github.com/ProgramadoresSemPatria/Team-1.git
   ```

### Backend setup:

1. **Navigate to the repository**:

    ```bash
    cd backend
     ```

2. **Set up docker**:

    ```bash
   docker compose up -d
     ```

3. **Check if containers are running properly**:

   ```bash
   docker ps
   ```

4. **Set up local env**:

   ```bash
    python3 -m venv venv
    ```

5. **Activate local env**:

    ```bash
    (windows)
     .\venv\Scripts\activate

    (mac/linux)
    .\venv\Scripts\activate
     ```

6. **Install the dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

7. **Set up .env file**

8. **Run backend**:

   ```bash
   uvicorn api.main:app --reload
   ```

### Frontend Setup

1. **Navigate to the repository**:

    ```bash
    cd frontend
     ```

2. **Install the dependencies**:

   ```bash
   npm install
   ```


8. **Run frontend**:

   ```bash
   npm run dev
   ```

## Deployed Version

You can also visit the deployed version of the application [here](https://visaocria-module-code-breakers-qsns.vercel.app/](https://teamonehackaton.vercel.app/).


## Conclusion

This project demonstrates the powerful combination of modern front-end and back-end technologies, with a strong focus on user experience, usability, and data management. Thank you for exploring the project! I welcome contributions and feedback to help enhance its capabilities further.

---

If you find any bugs or have a feature request, please open an issue on [GitHub](https://github.com/ProgramadoresSemPatria/Team-1/issues).
