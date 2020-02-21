import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateArtistDetailComponent } from './update-artist-detail.component';

describe('UpdateArtistDetailComponent', () => {
  let component: UpdateArtistDetailComponent;
  let fixture: ComponentFixture<UpdateArtistDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateArtistDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateArtistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
