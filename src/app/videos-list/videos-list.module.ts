import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VideosListComponent } from './videos-list.component';
import { VideoDetailCardComponent } from './video-detail-card/video-detail-card.component';
//import { UploadVideoComponent } from '../upload-video/upload-video.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { timeFormatter } from '../other/pipe/time-formatter';
import { SharedModule } from '../content-tab/shared/shared.module';

@NgModule({
  //declarations: [VideosListComponent, VideoDetailCardComponent, UploadVideoComponent],
  declarations: [VideosListComponent, VideoDetailCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: VideosListComponent }]),
    
    FormsModule,
    ReactiveFormsModule,
    SharedModule

  ]
})
export class VideosListModule { }
