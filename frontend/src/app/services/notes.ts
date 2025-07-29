// src/app/services/notes.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la estructura de una nota para usarla en toda la app
export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private apiUrl = 'http://127.0.0.1:8000/api/notes';

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  createNote(noteData: { title: string, content: string }): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, noteData);
  }

  updateNote(noteId: number, noteData: { title: string, content: string }): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${noteId}`, noteData);
  }

  deleteNote(noteId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${noteId}`);
  }
}