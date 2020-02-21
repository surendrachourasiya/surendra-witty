import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewPublishTabComponent } from './review-publish-tab.component';
import {Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewPublishContentListingComponent } from './review-publish-content-listing/review-publish-content-listing.component';
import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image'; 
import { SharedModule } from '../content-tab/shared/shared.module';
import { UpdateArtistDetailComponent } from '../content-tab/update-artist-detail/update-artist-detail.component';
import { UpdateCollectionDetailComponent } from '../content-tab/update-collection-detail/update-collection-detail.component';
import { UpdateIndividualDetailComponent } from '../content-tab/update-individual-detail/update-individual-detail.component';
import { UpdateShowDetailComponent } from '../content-tab/update-show-detail/update-show-detail.component';

const childRoutes: Routes =[
  { path: '', redirectTo: 'listing', pathMatch: 'full', component: ReviewPublishTabComponent },
  { path: 'listing', component: ReviewPublishContentListingComponent },
  { path: 'listing/:section', component: ReviewPublishContentListingComponent },
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
  declarations: [ReviewPublishTabComponent, ReviewPublishContentListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ReviewPublishTabModule { }
