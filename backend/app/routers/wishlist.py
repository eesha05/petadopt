from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])

def enrich_wishlist_out(item: models.Wishlist) -> schemas.WishlistOut:
    pet_out = None
    if item.pet:
        pet_out = schemas.PetOut(
            id=item.pet.id,
            shelter_id=item.pet.shelter_id,
            name=item.pet.name,
            species=item.pet.species,
            breed=item.pet.breed,
            age=item.pet.age,
            gender=item.pet.gender,
            size=item.pet.size,
            location=item.pet.location,
            description=item.pet.description,
            health_info=item.pet.health_info,
            vaccination_status=item.pet.vaccination_status,
            sterilized=item.pet.sterilized,
            image_url=item.pet.image_url,
            status=item.pet.status,
            created_at=item.pet.created_at,
            shelter_name=item.pet.shelter.organization_name if item.pet.shelter else None
        )
    return schemas.WishlistOut(
        id=item.id,
        pet_id=item.pet_id,
        user_id=item.user_id,
        created_at=item.created_at,
        pet=pet_out
    )

@router.get("", response_model=List[schemas.WishlistOut])
@router.get("/", response_model=List[schemas.WishlistOut])
def get_user_wishlist(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    items = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == current_user.id
    ).order_by(models.Wishlist.created_at.desc()).all()
    return [enrich_wishlist_out(i) for i in items]

@router.get("/ids", response_model=List[int])
def get_user_wishlist_ids(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    items = db.query(models.Wishlist.pet_id).filter(
        models.Wishlist.user_id == current_user.id
    ).all()
    return [i[0] for i in items]

@router.post("/{pet_id}")
def add_to_wishlist(
    pet_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    existing = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == current_user.id,
        models.Wishlist.pet_id == pet_id
    ).first()

    if existing:
        return {"message": "Pet already in wishlist", "pet_id": pet_id}

    item = models.Wishlist(user_id=current_user.id, pet_id=pet_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": "Added to wishlist successfully", "pet_id": pet_id}

@router.delete("/{pet_id}")
def remove_from_wishlist(
    pet_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == current_user.id,
        models.Wishlist.pet_id == pet_id
    ).first()

    if not item:
        return {"message": "Pet not found in wishlist", "pet_id": pet_id}

    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist successfully", "pet_id": pet_id}
