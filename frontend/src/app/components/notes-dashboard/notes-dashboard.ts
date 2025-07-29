// src/app/components/notes-dashboard/notes-dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth';
import { NotesService, Note } from '../../services/notes';
import { NoteDialogComponent } from '../note-dialog/note-dialog';

// Imports de Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule, MatCardModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './notes-dashboard.html',
  styleUrl: './notes-dashboard.css'
})
export class NotesDashboardComponent implements OnInit {
  notes: Note[] = [];

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.notesService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
      },
      error: () => {
        this.snackBar.open('Error al cargar las notas.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  deleteNote(noteId: number): void {
    // En una app real, aquí mostrarías un diálogo de confirmación
    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        this.snackBar.open('Nota eliminada.', 'Ok', { duration: 2000 });
        this.loadNotes(); // Recargar notas después de borrar
      },
      error: () => {
        this.snackBar.open('Error al eliminar la nota.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openNoteDialog(note?: Note): void {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '450px',
      data: note ? { ...note } : null // Pasa una copia de la nota o null si es nueva
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si el diálogo devuelve 'true', significa que se guardó algo
      if (result === true) {
        this.loadNotes();
      }
    });
  }
}