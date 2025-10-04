import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication-service';

/**
 * Authentication guard that checks if the user is authenticated.
 * If not authenticated, redirects to the authentication route.
 * @param route - The route being activated
 * @param state - The router state snapshot
 * @returns true if authenticated, false otherwise
 */
export const authenticationGuard: CanActivateFn = (route, state) => {
  // Inject the authentication service to check authentication status
  const service = inject(AuthenticationService);
  // Inject the router to perform navigation if not authenticated
  const router = inject(Router);

  // Return true if authenticated; otherwise, redirect to /authentication
  return service.isAuthenticated() || router.createUrlTree(['/authentication']);
};
