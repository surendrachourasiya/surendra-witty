import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPublishTabComponent } from './review-publish-tab.component';

describe('ReviewPublishTabComponent', () => {
  let component: ReviewPublishTabComponent;
  let fixture: ComponentFixture<ReviewPublishTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewPublishTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPublishTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
