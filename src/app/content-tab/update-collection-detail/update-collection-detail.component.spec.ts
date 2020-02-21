import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCollectionDetailComponent } from './update-collection-detail.component';

describe('UpdateCollectionDetailComponent', () => {
  let component: UpdateCollectionDetailComponent;
  let fixture: ComponentFixture<UpdateCollectionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCollectionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCollectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
