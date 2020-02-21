import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentTabComponent } from './content-tab.component';
import { Routes, RouterModule } from '@angular/router';
import { ContentListingComponent } from './content-listing/content-listing.component';
// import { ContentDetailCardComponent } from './shared/content-detail-card/content-detail-card.component';
// import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateArtistDetailComponent } from './update-artist-detail/update-artist-detail.component';
import { TagInputModule } from 'ngx-chips';
// import { GenreSubgenreListComponent } from './shared/genre-subgenre-list/genre-subgenre-list.component';
import { UpdateCollectionDetailComponent } from './update-collection-detail/update-collection-detail.component';
import { UpdateIndividualDetailComponent } from './update-individual-detail/update-individual-detail.component';
// import { timeFormatter } from '../other/pipe/time-formatter';
import { SharedModule } from './shared/shared.module';
import { UpdateShowDetailComponent } from './update-show-detail/update-show-detail.component';
import { VideoBindingPopupComponent } from './shared/video-binding-popup/video-binding-popup.component';
// import {DragDropModule} from '@angular/cdk/drag-drop';


// import {
//   LyThemeModule,
//   LY_THEME
// } from '@alyle/ui';



// import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
// import { LyButtonModule } from '@alyle/ui/button';
// import { LyIconModule } from '@alyle/ui/icon';
// import { LyTypographyModule } from '@alyle/ui/typography';

// /** Import theme */
// import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';



const childRoutes: Routes =[
  { path: '', redirectTo: 'listing', pathMatch: 'full', component: ContentTabComponent },
  { path: 'listing', component: ContentListingComponent },
  { path: 'listing/:section', component: ContentListingComponent },
  { path: 'update-artist', component: UpdateArtistDetailComponent },
  { path: 'update-artist/:slug', component: UpdateArtistDetailComponent },
  { path: 'update-collection', component: UpdateCollectionDetailComponent },
  { path: 'update-collection/:slug', component: UpdateCollectionDetailComponent },
  { path: 'update-individual', component: UpdateIndividualDetailComponent },
  { path: 'update-individual/:slug', component: UpdateIndividualDetailComponent },
  { path: 'update-show', component: UpdateShowDetailComponent },
  { path: 'update-show/:slug', component: UpdateShowDetailComponent },
]

@NgModule({
  declarations: [ContentTabComponent, ContentListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    SharedModule,
    // DragDropModule
    // LyThemeModule.setTheme('minima-dark'), // or minima-light 
    // LyResizingCroppingImageModule,
    // LyButtonModule,
    // LyIconModule,
    // LyTypographyModule
  ],
  // providers: [
  //   { provide: LY_THEME, useClass: MinimaLight, multi: true },
  //   { provide: LY_THEME, useClass: MinimaDark, multi: true }
  // ],
})
export class ContentTabModule { }
