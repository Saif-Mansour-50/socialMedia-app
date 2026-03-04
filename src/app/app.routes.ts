import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth/auth-guard';
import { notAuth } from './core/guards/noAuth/no-auth-guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { PostDetailsComponent } from './features/post-details/post-details.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { DetailsComponent } from './features/details/details.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { MyPostsComponent } from './features/my-posts/my-posts.component';
import { CommunityComponent } from './features/community/community.component';
import { SavedComponent } from './features/saved/saved.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [notAuth],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'post-details/:id', component: PostDetailsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'details/:id', component: DetailsComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
      { path: 'myPosts', component: MyPostsComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'saved', component: SavedComponent },
    ],
  },
  { path: '**', component: NotfoundComponent },
];
