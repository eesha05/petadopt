from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.dependencies.auth import get_current_user, require_role

router = APIRouter(prefix="/api/adoption-requests", tags=["adoption_requests"])

def enrich_adoption_request(req: models.AdoptionRequest) -> schemas.AdoptionRequestOut:
    pet_out = None
    if req.pet:
        pet_out = schemas.PetOut(
            id=req.pet.id,
            shelter_id=req.pet.shelter_id,
            name=req.pet.name,
            species=req.pet.species,
            breed=req.pet.breed,
            age=req.pet.age,
            gender=req.pet.gender,
            size=req.pet.size,
            location=req.pet.location,
            description=req.pet.description,
            health_info=req.pet.health_info,
            vaccination_status=req.pet.vaccination_status,
            sterilized=req.pet.sterilized,
            image_url=req.pet.image_url,
            status=req.pet.status,
            created_at=req.pet.created_at,
            shelter_name=req.pet.shelter.organization_name if req.pet.shelter else None
        )

    adopter_out = None
    if req.adopter:
        adopter_out = schemas.UserOut(
            id=req.adopter.id,
            name=req.adopter.name,
            email=req.adopter.email,
            phone=req.adopter.phone,
            address=req.adopter.address,
            role=req.adopter.role,
            is_active=req.adopter.is_active,
            created_at=req.adopter.created_at
        )

    return schemas.AdoptionRequestOut(
        id=req.id,
        pet_id=req.pet_id,
        adopter_id=req.adopter_id,
        full_name=req.full_name or (req.adopter.name if req.adopter else None),
        phone=req.phone or (req.adopter.phone if req.adopter else None),
        city=req.city,
        address=req.address or (req.adopter.address if req.adopter else None),
        housing_type=req.housing_type,
        own_or_rent=req.own_or_rent,
        pets_permitted=req.pets_permitted,
        experience=req.experience,
        other_pets=req.other_pets,
        daily_availability=req.daily_availability,
        reason=req.reason,
        agreed_to_terms=req.agreed_to_terms,
        message=req.message,
        status=req.status,
        created_at=req.created_at,
        pet=pet_out,
        adopter=adopter_out
    )

@router.post("", response_model=schemas.AdoptionRequestOut)
@router.post("/", response_model=schemas.AdoptionRequestOut)
def create_adoption_request(
    request: schemas.AdoptionRequestCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_role('adopter'))
):
    # Check if pet exists and is available
    pet = db.query(models.Pet).filter(models.Pet.id == request.pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    if pet.status != "available":
        raise HTTPException(status_code=400, detail="This pet is no longer available for adoption")

    # Check for existing pending request
    existing = db.query(models.AdoptionRequest).filter(
        models.AdoptionRequest.pet_id == request.pet_id,
        models.AdoptionRequest.adopter_id == current_user.id,
        models.AdoptionRequest.status == 'pending'
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending adoption application for this pet")

    new_request = models.AdoptionRequest(
        pet_id=request.pet_id,
        adopter_id=current_user.id,
        full_name=request.full_name,
        phone=request.phone,
        city=request.city,
        address=request.address,
        housing_type=request.housing_type,
        own_or_rent=request.own_or_rent,
        pets_permitted=request.pets_permitted,
        experience=request.experience,
        other_pets=request.other_pets,
        daily_availability=request.daily_availability,
        reason=request.reason,
        agreed_to_terms=request.agreed_to_terms,
        message=request.message or request.reason
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return enrich_adoption_request(new_request)

@router.get("/my", response_model=List[schemas.AdoptionRequestOut])
def get_my_requests(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_role('adopter'))
):
    requests = db.query(models.AdoptionRequest).filter(
        models.AdoptionRequest.adopter_id == current_user.id
    ).order_by(models.AdoptionRequest.created_at.desc()).all()
    return [enrich_adoption_request(r) for r in requests]

@router.get("/shelter", response_model=List[schemas.AdoptionRequestOut])
def get_shelter_requests(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_role('shelter'))
):
    shelter = db.query(models.Shelter).filter(models.Shelter.user_id == current_user.id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter profile not found")
    
    requests = db.query(models.AdoptionRequest).join(models.Pet).filter(
        models.Pet.shelter_id == shelter.id
    ).order_by(models.AdoptionRequest.created_at.desc()).all()
    return [enrich_adoption_request(r) for r in requests]

@router.patch("/{id}/approve", response_model=schemas.AdoptionRequestOut)
def approve_request(
    id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_role('shelter'))
):
    request = db.query(models.AdoptionRequest).filter(models.AdoptionRequest.id == id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    pet = db.query(models.Pet).filter(models.Pet.id == request.pet_id).first()
    shelter = db.query(models.Shelter).filter(models.Shelter.user_id == current_user.id).first()
    
    if current_user.role != 'admin' and (not shelter or pet.shelter_id != shelter.id):
        raise HTTPException(status_code=403, detail="Not authorized to approve this request")

    if request.status != 'pending':
        raise HTTPException(status_code=400, detail="Only pending requests can be approved")

    request.status = 'approved'
    pet.status = 'adopted'
    
    # Automatically reject other pending requests for this same pet
    other_requests = db.query(models.AdoptionRequest).filter(
        models.AdoptionRequest.pet_id == pet.id,
        models.AdoptionRequest.id != id,
        models.AdoptionRequest.status == 'pending'
    ).all()
    
    for r in other_requests:
        r.status = 'rejected'

    db.commit()
    db.refresh(request)
    return enrich_adoption_request(request)

@router.patch("/{id}/reject", response_model=schemas.AdoptionRequestOut)
def reject_request(
    id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_role('shelter'))
):
    request = db.query(models.AdoptionRequest).filter(models.AdoptionRequest.id == id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    pet = db.query(models.Pet).filter(models.Pet.id == request.pet_id).first()
    shelter = db.query(models.Shelter).filter(models.Shelter.user_id == current_user.id).first()
    
    if current_user.role != 'admin' and (not shelter or pet.shelter_id != shelter.id):
        raise HTTPException(status_code=403, detail="Not authorized to reject this request")

    if request.status != 'pending':
        raise HTTPException(status_code=400, detail="Only pending requests can be rejected")

    request.status = 'rejected'
    db.commit()
    db.refresh(request)
    return enrich_adoption_request(request)
