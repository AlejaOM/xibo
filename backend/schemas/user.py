from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
import re

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    birth_date: date
    phone: str | None = None

class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 10:
            raise ValueError('La contraseña debe tener al menos 10 caracteres')
        if not re.search(r'[A-Z]', v):
            raise ValueError('La contraseña debe contener al menos una mayúscula')
        if not re.search(r'[a-z]', v):
            raise ValueError('La contraseña debe contener al menos una minúscula')
        if not re.search(r'[0-9]', v):
            raise ValueError('La contraseña debe contener al menos un número')
        if not re.search(r'[\W_]', v):
            raise ValueError('La contraseña debe contener al menos un carácter especial')
        return v

class UserRegister(UserCreate):
    recaptcha_token: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    recaptcha_token: str