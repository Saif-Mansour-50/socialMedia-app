import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const notAuth: CanActivateFn = (route, state) => {
  let router = inject(Router);

  if (localStorage.getItem('token') != null) {
    return router.parseUrl('/home');
  } else {
    return true;
  }
};
