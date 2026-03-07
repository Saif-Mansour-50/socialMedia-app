import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth/auth-guard';
import { notAuth } from './core/guards/noAuth/no-auth-guard';
import { HomeComponent } from './features/posts/pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { NotificationsComponent } from './features/notification/pages/notifications/notifications.component';
import { PostDetailsComponent } from './features/posts/components/post-details/post-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { MyPostsComponent } from './features/posts/pages/my-posts/my-posts.component';
import { CommunityComponent } from './features/posts/pages/community/community.component';
import { SavedComponent } from './features/posts/pages/saved/saved.component';
import { DetailsComponent } from './features/posts/pages/details/details.component';
import { ChangePasswordComponent } from './features/auth/pages/change-password/change-password.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [notAuth],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
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
