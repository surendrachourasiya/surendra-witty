import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreSubgenreListComponent } from './genre-subgenre-list.component';

describe('GenreSubgenreListComponent', () => {
  let component: GenreSubgenreListComponent;
  let fixture: ComponentFixture<GenreSubgenreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreSubgenreListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreSubgenreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
