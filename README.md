# Pet Adoption Portal

A complete web-based platform connecting people who want to adopt pets with shelters/rescuers that have pets available for adoption.

## Features
- **3 User Roles**: Adopter, Shelter/Rescuer, Admin.
- **Adopters**: Browse, search, filter pets, and submit adoption requests.
- **Shelters**: Manage pet listings, review adoption requests.
- **Admin**: Moderate users and pets, view statistics.

## Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL
- **Authentication**: JWT & bcrypt

## Prerequisites
- Node.js & npm
- Python 3.9+
- PostgreSQL (or Docker/Docker Compose)

## Installation

### Database Setup (Docker)
If you have Docker, you can run:
```bash
docker-compose up -d
```
This will start PostgreSQL and run `schema.sql` and `seed.sql`.

If running PostgreSQL manually, create a database named `petadoption` and run `database/schema.sql` followed by `database/seed.sql`.

### Backend Setup
```bash
cd backend
python -m venv venv
# Activate the environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
The API will run on `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Test Accounts (from seed data)
All passwords are `password123`.

**Admin**
- Email: `admin@example.com`

**Shelter/Rescuer**
- Email: `shelter1@example.com`
- Email: `shelter2@example.com`

**Adopter**
- Email: `adopter1@example.com`
- Email: `adopter2@example.com`
