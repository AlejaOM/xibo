import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDialog } from './note-dialog';

describe('NoteDialog', () => {
  let component: NoteDialog;
  let fixture: ComponentFixture<NoteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
