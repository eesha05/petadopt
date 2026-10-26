from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, pets, adoption, users, admin, wishlist
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Pet Adoption Portal API", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(pets.router)
app.include_router(adoption.router)
app.include_router(wishlist.router)
app.include_router(users.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Pet Adoption Portal API", "status": "online"}
