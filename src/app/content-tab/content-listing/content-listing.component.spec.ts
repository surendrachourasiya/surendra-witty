import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentListingComponent } from './content-listing.component';

describe('ContentListingComponent', () => {
  let component: ContentListingComponent;
  let fixture: ComponentFixture<ContentListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
