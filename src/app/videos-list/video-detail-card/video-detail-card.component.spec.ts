import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDetailCardComponent } from './video-detail-card.component';

describe('VideoDetailCardComponent', () => {
  let component: VideoDetailCardComponent;
  let fixture: ComponentFixture<VideoDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
