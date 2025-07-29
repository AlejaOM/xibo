import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDashboard } from './notes-dashboard';

describe('NotesDashboard', () => {
  let component: NotesDashboard;
  let fixture: ComponentFixture<NotesDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
