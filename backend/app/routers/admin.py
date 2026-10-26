from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app import models, schemas
from app.database import get_db
from app.dependencies.auth import require_role
from app.routers.adoption import enrich_adoption_request

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: models.User = Depends(require_role('admin'))):
    total_users = db.query(func.count(models.User.id)).scalar()
    total_adopters = db.query(func.count(models.User.id)).filter(models.User.role == 'adopter').scalar()
    total_shelters = db.query(func.count(models.User.id)).filter(models.User.role == 'shelter').scalar()
    
    total_pets = db.query(func.count(models.Pet.id)).scalar()
    available_pets = db.query(func.count(models.Pet.id)).filter(models.Pet.status == 'available').scalar()
    adopted_pets = db.query(func.count(models.Pet.id)).filter(models.Pet.status == 'adopted').scalar()
    
    pending_requests = db.query(func.count(models.AdoptionRequest.id)).filter(models.AdoptionRequest.status == 'pending').scalar()
    approved_requests = db.query(func.count(models.AdoptionRequest.id)).filter(models.AdoptionRequest.status == 'approved').scalar()
    rejected_requests = db.query(func.count(models.AdoptionRequest.id)).filter(models.AdoptionRequest.status == 'rejected').scalar()
    
    return {
        "total_users": total_users,
        "total_adopters": total_adopters,
        "total_shelters": total_shelters,
        "total_pets": total_pets,
        "available_pets": available_pets,
        "adopted_pets": adopted_pets,
        "pending_requests": pending_requests,
        "approved_requests": approved_requests,
        "rejected_requests": rejected_requests
    }

@router.get("/requests", response_model=List[schemas.AdoptionRequestOut])
def get_all_requests(db: Session = Depends(get_db), current_user: models.User = Depends(require_role('admin'))):
    requests = db.query(models.AdoptionRequest).order_by(models.AdoptionRequest.created_at.desc()).all()
    return [enrich_adoption_request(r) for r in requests]
