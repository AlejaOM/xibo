from db.session import engine
from models.user import Base as UserBase
from models.note import Base as NoteBase

def init_db():
    # Crear tablas en la base de datos
    UserBase.metadata.create_all(bind=engine)
    NoteBase.metadata.create_all(bind=engine)