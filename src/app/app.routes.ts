import { AllFriendsComponent } from './features/posts/components/all-friends/all-friends.component';
import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth/auth-guard';
import { notAuth } from './core/guards/noAuth/no-auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Auth Layout - غير مسجل دخول
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((c) => c.AuthLayoutComponent),
    canActivate: [notAuth],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register/register.component').then(
            (c) => c.RegisterComponent,
          ),
      },
    ],
  },

  // Blank Layout - مسجل دخول
  {
    path: '',
    loadComponent: () =>
      import('./layouts/blank-layout/blank-layout.component').then((c) => c.BlankLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/posts/pages/home/home.component').then((c) => c.HomeComponent),
        children: [
          { path: '', redirectTo: 'feed', pathMatch: 'full' },
          {
            path: 'feed',
            loadComponent: () =>
              import('./features/posts/pages/feed/feed.component').then((c) => c.FeedComponent),
          },
          {
            path: 'community',
            loadComponent: () =>
              import('./features/posts/pages/community/community.component').then(
                (c) => c.CommunityComponent,
              ),
          },
          {
            path: 'my-posts',
            loadComponent: () =>
              import('./features/posts/pages/my-posts/my-posts.component').then(
                (c) => c.MyPostsComponent,
              ),
          },
          {
            path: 'saved',
            loadComponent: () =>
              import('./features/posts/pages/saved/saved.component').then((c) => c.SavedComponent),
          },
        ],
      },
      {
        path: 'post-details/:id',
        loadComponent: () =>
          import('./features/posts/pages/post-details/post-details.component').then(
            (c) => c.PostDetailsComponent,
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notification/pages/notifications/notifications.component').then(
            (c) => c.NotificationsComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((c) => c.ProfileComponent),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./features/posts/pages/details/details.component').then(
            (c) => c.DetailsComponent,
          ),
      },
      {
        path: 'all-friends',
        loadComponent: () =>
          import('./features/posts/components/all-friends/all-friends.component').then(
            (c) => c.AllFriendsComponent,
          ),
      },
      {
        path: 'changePassword',
        loadComponent: () =>
          import('./features/auth/pages/change-password/change-password.component').then(
            (c) => c.ChangePasswordComponent,
          ),
      },
    ],
  },

  // Not Found - 404
  {
    path: '**',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then((c) => c.NotfoundComponent),
  },
];
