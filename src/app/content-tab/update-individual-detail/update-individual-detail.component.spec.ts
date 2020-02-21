import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIndividualDetailComponent } from './update-individual-detail.component';

describe('UpdateIndividualDetailComponent', () => {
  let component: UpdateIndividualDetailComponent;
  let fixture: ComponentFixture<UpdateIndividualDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateIndividualDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateIndividualDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
