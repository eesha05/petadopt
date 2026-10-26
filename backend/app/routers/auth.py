from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.utils.auth import verify_password, get_password_hash, create_access_token
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

def enrich_user_out(user: models.User) -> schemas.UserOut:
    org_name = user.shelter_profile.organization_name if user.shelter_profile else None
    return schemas.UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        address=user.address,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        organization_name=org_name
    )

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        phone=user.phone,
        address=user.address
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if user.role == 'shelter':
        new_shelter = models.Shelter(
            user_id=new_user.id,
            organization_name=user.organization_name or user.name,
            description=user.description,
            address=user.address
        )
        db.add(new_shelter)
        db.commit()
        db.refresh(new_user)

    return enrich_user_out(new_user)

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated. Contact admin.",
        )
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": enrich_user_out(user)
    }

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return enrich_user_out(current_user)

@router.put("/profile", response_model=schemas.UserOut)
def update_profile(
    profile_data: schemas.UserUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if profile_data.name is not None:
        current_user.name = profile_data.name
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone
    if profile_data.address is not None:
        current_user.address = profile_data.address

    if current_user.role == 'shelter' and current_user.shelter_profile:
        if profile_data.organization_name is not None:
            current_user.shelter_profile.organization_name = profile_data.organization_name
        if profile_data.description is not None:
            current_user.shelter_profile.description = profile_data.description
        if profile_data.address is not None:
            current_user.shelter_profile.address = profile_data.address

    db.commit()
    db.refresh(current_user)
    return enrich_user_out(current_user)
