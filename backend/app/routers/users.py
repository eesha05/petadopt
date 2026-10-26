from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.dependencies.auth import require_role
from app.routers.auth import enrich_user_out

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("", response_model=List[schemas.UserOut])
@router.get("/", response_model=List[schemas.UserOut])
def get_users(db: Session = Depends(get_db), current_user: models.User = Depends(require_role('admin'))):
    users = db.query(models.User).order_by(models.User.id.asc()).all()
    return [enrich_user_out(u) for u in users]

@router.get("/{id}", response_model=schemas.UserOut)
def get_user(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_role('admin'))):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return enrich_user_out(user)

@router.put("/{id}", response_model=schemas.UserOut)
def update_user(id: int, user_update: schemas.UserBase, db: Session = Depends(get_db), current_user: models.User = Depends(require_role('admin'))):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
        
    db.commit()
    db.refresh(user)
    return enrich_user_out(user)

@router.patch("/{id}/toggle-status", response_model=schemas.UserOut)
def toggle_user_status(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_role('admin'))):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot toggle your own admin status")
    
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return enrich_user_out(user)

@router.delete("/{id}")
def delete_user(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_role('admin'))):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    
    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}
