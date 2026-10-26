from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from app import models, schemas
from app.database import get_db
from app.dependencies.auth import get_current_user, require_role

router = APIRouter(prefix="/api/pets", tags=["pets"])

def enrich_pet_out(pet: models.Pet) -> schemas.PetOut:
    shelter_name = pet.shelter.organization_name if pet.shelter else None
    return schemas.PetOut(
        id=pet.id,
        shelter_id=pet.shelter_id,
        name=pet.name,
        species=pet.species,
        breed=pet.breed,
        age=pet.age,
        gender=pet.gender,
        size=pet.size,
        location=pet.location,
        description=pet.description,
        health_info=pet.health_info,
        vaccination_status=pet.vaccination_status,
        sterilized=pet.sterilized,
        image_url=pet.image_url,
        status=pet.status,
        created_at=pet.created_at,
        shelter_name=shelter_name
    )

@router.get("", response_model=List[schemas.PetOut])
@router.get("/", response_model=List[schemas.PetOut])
def get_pets(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    species: Optional[str] = None,
    breed: Optional[str] = None,
    size: Optional[str] = None,
    gender: Optional[str] = None,
    location: Optional[str] = None,
    age_group: Optional[str] = None,
    status: Optional[str] = "available",
    sort_by: Optional[str] = "newest"
):
    query = db.query(models.Pet).join(models.Shelter)

    if status and status.lower() != "all":
        query = query.filter(models.Pet.status == status.lower())

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                models.Pet.name.ilike(search_term),
                models.Pet.breed.ilike(search_term),
                models.Pet.species.ilike(search_term),
                models.Pet.description.ilike(search_term),
                models.Pet.location.ilike(search_term)
            )
        )

    if species and species.lower() != "all":
        query = query.filter(models.Pet.species.ilike(species.strip()))

    if breed and breed.lower() != "all":
        query = query.filter(models.Pet.breed.ilike(f"%{breed.strip()}%"))

    if size and size.lower() != "all":
        query = query.filter(models.Pet.size.ilike(size.strip()))

    if gender and gender.lower() != "all":
        query = query.filter(models.Pet.gender.ilike(gender.strip()))

    if location and location.lower() != "all":
        query = query.filter(models.Pet.location.ilike(f"%{location.strip()}%"))

    if age_group:
        if age_group == "baby":
            query = query.filter(models.Pet.age <= 1)
        elif age_group == "young":
            query = query.filter(and_(models.Pet.age > 1, models.Pet.age <= 3))
        elif age_group == "adult":
            query = query.filter(and_(models.Pet.age > 3, models.Pet.age <= 6))
        elif age_group == "senior":
            query = query.filter(models.Pet.age > 6)

    if sort_by == "newest":
        query = query.order_by(models.Pet.created_at.desc())
    elif sort_by == "oldest":
        query = query.order_by(models.Pet.created_at.asc())
    elif sort_by == "age_asc":
        query = query.order_by(models.Pet.age.asc())
    elif sort_by == "age_desc":
        query = query.order_by(models.Pet.age.desc())
    elif sort_by == "name_asc":
        query = query.order_by(models.Pet.name.asc())
    else:
        query = query.order_by(models.Pet.id.desc())

    pets = query.all()
    return [enrich_pet_out(p) for p in pets]

@router.get("/my", response_model=List[schemas.PetOut])
def get_my_pets(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role('shelter'))
):
    shelter = db.query(models.Shelter).filter(models.Shelter.user_id == current_user.id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter profile not found")
    
    pets = db.query(models.Pet).filter(models.Pet.shelter_id == shelter.id).order_by(models.Pet.created_at.desc()).all()
    return [enrich_pet_out(p) for p in pets]

@router.get("/{id}", response_model=schemas.PetOut)
def get_pet(id: int, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return enrich_pet_out(pet)

@router.post("", response_model=schemas.PetOut)
@router.post("/", response_model=schemas.PetOut)
def create_pet(
    pet: schemas.PetCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_role('shelter'))
):
    shelter = db.query(models.Shelter).filter(models.Shelter.user_id == current_user.id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter profile not found")
    
    new_pet = models.Pet(**pet.model_dump(), shelter_id=shelter.id)
    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    return enrich_pet_out(new_pet)

@router.put("/{id}", response_model=schemas.PetOut)
def update_pet(
    id: int, 
    pet_update: schemas.PetCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_role('shelter'))
):
    pet = db.query(models.Pet).filter(models.Pet.id == id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    shelter = db.query(models.Shelter).filter(models.Shelter.user_id == current_user.id).first()
    if current_user.role != 'admin' and (not shelter or pet.shelter_id != shelter.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this pet")

    for key, value in pet_update.model_dump().items():
        setattr(pet, key, value)
    
    db.commit()
    db.refresh(pet)
    return enrich_pet_out(pet)

@router.patch("/{id}/status", response_model=schemas.PetOut)
def update_pet_status(
    id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role('shelter'))
):
    pet = db.query(models.Pet).filter(models.Pet.id == id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    shelter = db.query(models.Shelter).filter(models.Shelter.user_id == current_user.id).first()
    if current_user.role != 'admin' and (not shelter or pet.shelter_id != shelter.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this pet")

    valid_statuses = ['available', 'pending', 'adopted', 'unavailable']
    if status.lower() not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    pet.status = status.lower()
    db.commit()
    db.refresh(pet)
    return enrich_pet_out(pet)

@router.delete("/{id}")
def delete_pet(
    id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_role('shelter'))
):
    pet = db.query(models.Pet).filter(models.Pet.id == id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    shelter = db.query(models.Shelter).filter(models.Shelter.user_id == current_user.id).first()
    if current_user.role != 'admin' and (not shelter or pet.shelter_id != shelter.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this pet")
    
    db.delete(pet)
    db.commit()
    return {"detail": "Pet deleted successfully"}
