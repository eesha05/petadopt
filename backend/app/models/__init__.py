from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # 'adopter', 'shelter', 'admin'
    phone = Column(String)
    address = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    shelter_profile = relationship("Shelter", back_populates="user", uselist=False, cascade="all, delete-orphan")
    adoption_requests = relationship("AdoptionRequest", back_populates="adopter", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")

class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_name = Column(String, nullable=False)
    description = Column(Text)
    address = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="shelter_profile")
    pets = relationship("Pet", back_populates="shelter", cascade="all, delete-orphan")

class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    shelter_id = Column(Integer, ForeignKey("shelters.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    breed = Column(String)
    age = Column(Integer)
    gender = Column(String)
    size = Column(String)
    location = Column(Text)
    description = Column(Text)
    health_info = Column(Text)
    vaccination_status = Column(String)
    sterilized = Column(Boolean, default=False)
    image_url = Column(Text)
    status = Column(String, default="available") # available, pending, adopted, unavailable
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    shelter = relationship("Shelter", back_populates="pets")
    adoption_requests = relationship("AdoptionRequest", back_populates="pet", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="pet", cascade="all, delete-orphan")

class AdoptionRequest(Base):
    __tablename__ = "adoption_requests"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), nullable=False)
    adopter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String)
    phone = Column(String)
    city = Column(String)
    address = Column(Text)
    housing_type = Column(String)
    own_or_rent = Column(String)
    pets_permitted = Column(Boolean, default=True)
    experience = Column(Text)
    other_pets = Column(Text)
    daily_availability = Column(String)
    reason = Column(Text)
    agreed_to_terms = Column(Boolean, default=True)
    message = Column(Text)
    status = Column(String, default="pending") # pending, approved, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    pet = relationship("Pet", back_populates="adoption_requests")
    adopter = relationship("User", back_populates="adoption_requests")

    __table_args__ = (
        UniqueConstraint('pet_id', 'adopter_id', name='unique_active_request'),
    )

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="wishlists")
    pet = relationship("Pet", back_populates="wishlists")

    __table_args__ = (
        UniqueConstraint('user_id', 'pet_id', name='unique_user_pet_wishlist'),
    )
