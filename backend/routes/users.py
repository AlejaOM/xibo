from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import User, UserLogin, Token, UserRegister
from crud import user as crud_user
from core.security import create_access_token, verify_password
from db.session import get_db
import requests
from core.config import settings
from models.user import User as UserModel # <-- IMPORTANTE: Añadir esta importación

router = APIRouter()

def verify_recaptcha(token: str):
    response = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={"secret": settings.RECAPTCHA_SECRET_KEY, "response": token}
    )
    return response.json().get("success", False)

@router.post("/register", response_model=User)
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    if not verify_recaptcha(user.recaptcha_token):
        raise HTTPException(status_code=400, detail="Invalid reCAPTCHA")
    db_user = crud_user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud_user.create_user(db=db, user=user)

@router.post("/login", response_model=Token)
def login_for_access_token(form_data: UserLogin, db: Session = Depends(get_db)):
    if not verify_recaptcha(form_data.recaptcha_token):
        raise HTTPException(status_code=400, detail="Invalid reCAPTCHA")
        
    user: UserModel | None = crud_user.get_user_by_email(db, email=form_data.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
