from sqlalchemy.orm import Session
from models.user import User as UserModel
from schemas.user import UserCreate as UserSchema
from core.security import get_password_hash

# La clave está aquí: -> UserModel | None
# Esto le dice a Pylance exactamente qué tipo de objeto devuelve la función.
def get_user_by_email(db: Session, email: str) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.email == email).first()

def create_user(db: Session, user: UserSchema) -> UserModel:
    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        birth_date=user.birth_date,
        phone=user.phone,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user