import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDetailCardComponent } from './content-detail-card.component';

describe('ContentDetailCardComponent', () => {
  let component: ContentDetailCardComponent;
  let fixture: ComponentFixture<ContentDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
