# 1. Shelter Donations — Backend (FastAPI)

This is the backend service for the **Shelter Donations** full-stack application.  
It provides RESTful APIs to create, read, update, and delete donation records for a local animal shelter.

---

## Tech Stack

- **Language:** Python 3.8+
- **Framework:** FastAPI
- **ORM:** SQLAlchemy 2.x
- **Database:** SQLite (file-based)
- **Environment:** Virtual environment (`.venv`)
- **Server:** Uvicorn

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/<your-repo>/shelter-donations.git
cd shelter-donations
```

### 2. Create and Activate Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

If you're on Windows, use:
```bash
.venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r app/requirements.txt
```

## Running the Backend

Run Uvicorn using your virtual environment’s Python executable:

```bash
./.venv/bin/python -m uvicorn app.main:app --reload --port 8000 --app-dir backend
```

Alternate (if your shell is already inside .venv and in the backend/ folder)

```bash
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once the server is running, open:

Swagger UI:

```bash
http://127.0.0.1:8000/docs
```

ReDoc:

```bash
http://127.0.0.1:8000/redoc
```

## Test the Endpoints

Example using curl:

```bash
# Create a new donation
curl -X POST http://127.0.0.1:8000/donations \
  -H "Content-Type: application/json" \
  -d '{"donor_name": "Amy", "donation_type": "food", "amount": 10, "date": "2025-10-07"}'

# List all donations
curl http://127.0.0.1:8000/donations

# Update a donation
curl -X PUT http://127.0.0.1:8000/donations/1 \
  -H "Content-Type: application/json" \
  -d '{"amount": 25}'

# Delete a donation
curl -X DELETE http://127.0.0.1:8000/donations/1

```

