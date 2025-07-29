from sqlalchemy.orm import Session
from models import note as model_note
from schemas import note as schema_note

def get_note(db: Session, note_id: int):
    """
    Obtiene una nota específica por su ID.
    """
    return db.query(model_note.Note).filter(model_note.Note.id == note_id).first()

def get_notes_by_owner(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    """
    Obtiene una lista de notas que pertenecen a un usuario específico.
    """
    return db.query(model_note.Note).filter(model_note.Note.user_id == owner_id).offset(skip).limit(limit).all()

def create_user_note(db: Session, note: schema_note.NoteCreate, user_id: int):
    """
    Crea una nueva nota y la asocia con un usuario.
    """
    db_note = model_note.Note(**note.model_dump(), user_id=user_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def update_note(db: Session, db_note: model_note.Note, note_in: schema_note.NoteCreate):
    """
    Actualiza los datos de una nota existente.
    """
    note_data = note_in.model_dump(exclude_unset=True)
    for key, value in note_data.items():
        setattr(db_note, key, value)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def delete_note(db: Session, db_note: model_note.Note):
    """
    Elimina una nota de la base de datos.
    """
    db.delete(db_note)
    db.commit()
    return db_note
