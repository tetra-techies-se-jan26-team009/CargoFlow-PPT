from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserRole
from ..schemas import UserRegister, UserLogin, UserUpdate
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", status_code=201)
def register_user(data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    role = UserRole.BUSINESS_CLIENT
    user = User(name=data.name,
                email=data.email,
                phone=data.phone,
                city=data.city,
                password_hash=hash_password(data.password),
                role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role.value
        }
    }

@router.post("/login", status_code=200)
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is blocked")

    token = create_access_token({"sub": user.email, "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role.value
    }

@router.get("/me", status_code=200)
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role.value
    }

@router.patch("/me", status_code=200)
def update_me(data: UserUpdate, 
              db: Session = Depends(get_db), 
              current_user: User = Depends(get_current_user)):

    if data.name is not None:
        current_user.name = data.name

    if data.email is not None:
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already in use")
        else:
            current_user.email = data.email

    if data.phone is not None:
        current_user.phone = data.phone
    
    if data.password is not None:
        current_user.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "role": current_user.role.value
        }
    }