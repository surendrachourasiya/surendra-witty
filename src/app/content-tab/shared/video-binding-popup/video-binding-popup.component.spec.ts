import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBindingPopupComponent } from './video-binding-popup.component';

describe('VideoBindingPopupComponent', () => {
  let component: VideoBindingPopupComponent;
  let fixture: ComponentFixture<VideoBindingPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoBindingPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoBindingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
