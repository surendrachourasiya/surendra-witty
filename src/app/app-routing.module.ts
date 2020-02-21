import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', canActivate: [AuthGuard], pathMatch: 'full' },
  // { path: 'upload', pathMatch: './file/file-upload'},

  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'content', pathMatch: 'full' },
      { path: 'videos', loadChildren: './videos-list/videos-list.module#VideosListModule' },
      { path: 'content', loadChildren: './content-tab/content-tab.module#ContentTabModule' },
      { path: 'review-publish', loadChildren: './review-publish-tab/review-publish-tab.module#ReviewPublishTabModule' },
      { path: 'home', loadChildren: './home-tab/home-tab.module#HomeTabModule' },
      { path: '**', redirectTo: 'content', pathMatch: 'full' },
    ]
  },
  // { path: '**', redirectTo: 'dashboard/content', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
