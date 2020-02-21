import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShowDetailComponent } from './update-show-detail.component';

describe('UpdateShowDetailComponent', () => {
  let component: UpdateShowDetailComponent;
  let fixture: ComponentFixture<UpdateShowDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateShowDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateShowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
