import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  const userData = sessionStorage.getItem('user');

  if (!userData) {
    return router.createUrlTree(['/']);
  }

  const user = JSON.parse(userData);
  const expectedRoles = route.data['roles'] as Array<string>;

  if (expectedRoles && !expectedRoles.includes(user.user.profile.profile)) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
