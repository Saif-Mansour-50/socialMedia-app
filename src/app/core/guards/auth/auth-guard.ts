import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);

  if (localStorage.getItem('token') != null) {
    return true;
  } else {
    return router.parseUrl('/login');
  }
};
