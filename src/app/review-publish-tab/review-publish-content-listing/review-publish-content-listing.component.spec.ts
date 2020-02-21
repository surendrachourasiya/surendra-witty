import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPublishContentListingComponent } from './review-publish-content-listing.component';

describe('ReviewPublishContentListingComponent', () => {
  let component: ReviewPublishContentListingComponent;
  let fixture: ComponentFixture<ReviewPublishContentListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewPublishContentListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPublishContentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
