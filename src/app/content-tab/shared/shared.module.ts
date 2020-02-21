import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ReviewPublishTabComponent } from './review-publish-tab.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image'; 
import { timeFormatter } from '../../other/pipe/time-formatter';
import { ContentDetailCardComponent } from './content-detail-card/content-detail-card.component';
import { UpdateArtistDetailComponent } from '../update-artist-detail/update-artist-detail.component';
import { GenreSubgenreListComponent } from '../shared/genre-subgenre-list/genre-subgenre-list.component';
import { TagInputModule } from 'ngx-chips';
import { UpdateCollectionDetailComponent } from '../update-collection-detail/update-collection-detail.component';
import { UpdateIndividualDetailComponent } from '../update-individual-detail/update-individual-detail.component';
import { UpdateShowDetailComponent } from '../update-show-detail/update-show-detail.component';
import { VideoBindingPopupComponent } from './video-binding-popup/video-binding-popup.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [timeFormatter, ContentDetailCardComponent, UpdateArtistDetailComponent, GenreSubgenreListComponent, UpdateCollectionDetailComponent, UpdateIndividualDetailComponent, UpdateShowDetailComponent, VideoBindingPopupComponent],
  imports: [
    LazyLoadImageModule.forRoot({
      preset: scrollPreset 
    }),
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    DragDropModule
  ],
  exports: [LazyLoadImageModule,timeFormatter, ContentDetailCardComponent, UpdateArtistDetailComponent, GenreSubgenreListComponent, UpdateCollectionDetailComponent, UpdateIndividualDetailComponent, UpdateShowDetailComponent, VideoBindingPopupComponent]
})
export class SharedModule { }