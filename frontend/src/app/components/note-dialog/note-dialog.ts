// src/app/components/note-dialog/note-dialog.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NotesService, Note } from '../../services/notes';

// Imports de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSnackBarModule
  ],
  templateUrl: './note-dialog.html',
  styleUrl: './note-dialog.css'
})
export class NoteDialogComponent {
  noteForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private notesService: NotesService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Note | null
  ) {
    this.isEditMode = !!this.data; // Si hay datos, estamos en modo edición
    this.noteForm = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      content: [this.data?.content || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.noteForm.invalid) {
      return;
    }

    const noteData = this.noteForm.value;
    const operation = this.isEditMode
      ? this.notesService.updateNote(this.data!.id, noteData)
      : this.notesService.createNote(noteData);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Nota actualizada' : 'Nota creada';
        this.snackBar.open(message, 'Ok', { duration: 2000 });
        this.dialogRef.close(true); // Devuelve 'true' para indicar que se guardó
      },
      error: () => {
        this.snackBar.open('Error al guardar la nota.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}