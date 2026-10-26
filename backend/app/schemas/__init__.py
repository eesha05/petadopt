from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: str # 'adopter', 'shelter', 'admin'
    organization_name: Optional[str] = None
    description: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    organization_name: Optional[str] = None
    description: Optional[str] = None

class ShelterOut(BaseModel):
    id: int
    user_id: int
    organization_name: str
    description: Optional[str] = None
    address: Optional[str] = None

    class Config:
        from_attributes = True

class UserOut(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    organization_name: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    health_info: Optional[str] = None
    vaccination_status: Optional[str] = None
    sterilized: Optional[bool] = False
    image_url: Optional[str] = None
    status: Optional[str] = "available"

class PetCreate(PetBase):
    pass

class PetOut(PetBase):
    id: int
    shelter_id: int
    created_at: datetime
    shelter_name: Optional[str] = None

    class Config:
        from_attributes = True

class AdoptionRequestBase(BaseModel):
    pet_id: int
    full_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    housing_type: Optional[str] = None # apartment, independent house, other
    own_or_rent: Optional[str] = None # own, rent
    pets_permitted: Optional[bool] = True
    experience: Optional[str] = None
    other_pets: Optional[str] = None
    daily_availability: Optional[str] = None
    reason: Optional[str] = None
    agreed_to_terms: Optional[bool] = True
    message: Optional[str] = None

class AdoptionRequestCreate(AdoptionRequestBase):
    full_name: str
    phone: str
    city: str
    address: str
    housing_type: str
    own_or_rent: str
    reason: str
    agreed_to_terms: bool

class AdoptionRequestOut(AdoptionRequestBase):
    id: int
    adopter_id: int
    status: str
    created_at: datetime
    pet: Optional[PetOut] = None
    adopter: Optional[UserOut] = None

    class Config:
        from_attributes = True

class WishlistOut(BaseModel):
    id: int
    pet_id: int
    user_id: int
    created_at: datetime
    pet: Optional[PetOut] = None

    class Config:
        from_attributes = True
