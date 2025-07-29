from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from schemas import note as schema_note
from models import user as model_user
from crud import note as crud_note
from db.session import get_db
from core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=schema_note.Note)
def create_note(
    note: schema_note.NoteCreate,
    db: Session = Depends(get_db),
    current_user: model_user.User = Depends(get_current_user)
):
    """
    Crea una nueva nota para el usuario autenticado.
    """
    return crud_note.create_user_note(db=db, note=note, user_id=current_user.id)


@router.get("/", response_model=List[schema_note.Note])
def read_notes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: model_user.User = Depends(get_current_user)
):
    """
    Obtiene todas las notas del usuario autenticado.
    """
    notes = crud_note.get_notes_by_owner(db, owner_id=current_user.id, skip=skip, limit=limit)
    return notes


@router.get("/{note_id}", response_model=schema_note.Note)
def read_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: model_user.User = Depends(get_current_user)
):
    """
    Obtiene una nota específica por su ID.
    Verifica que la nota pertenezca al usuario autenticado.
    """
    db_note = crud_note.get_note(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    if db_note.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this note")
    return db_note


@router.put("/{note_id}", response_model=schema_note.Note)
def update_user_note(
    note_id: int,
    note_in: schema_note.NoteCreate,
    db: Session = Depends(get_db),
    current_user: model_user.User = Depends(get_current_user)
):
    """
    Actualiza una nota existente.
    Verifica que la nota pertenezca al usuario autenticado.
    """
    db_note = crud_note.get_note(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    if db_note.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this note")
    
    return crud_note.update_note(db=db, db_note=db_note, note_in=note_in)


@router.delete("/{note_id}", response_model=schema_note.Note)
def delete_user_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: model_user.User = Depends(get_current_user)
):
    """
    Elimina una nota.
    Verifica que la nota pertenezca al usuario autenticado.
    """
    db_note = crud_note.get_note(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    if db_note.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this note")

    return crud_note.delete_note(db=db, db_note=db_note)
