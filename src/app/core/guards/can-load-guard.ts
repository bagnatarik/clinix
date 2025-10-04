import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication-service';

/**
 * Guard function that determines whether a route can be loaded.
 * Redirects to the authentication page if the user is not authenticated.
 * @param route - The route to be loaded
 * @param segments - The URL segments
 * @returns true if the user is authenticated; otherwise, a UrlTree to redirect to the authentication page
 */
export const canLoadGuard: CanMatchFn = (route, segments) => {
  // Inject the authentication service to check authentication status
  const service = inject(AuthenticationService);
  // Inject the router to perform navigation if not authenticated
  const router = inject(Router);

  // Return true if authenticated; otherwise, redirect to /authentication
  return service.isAuthenticated() || router.createUrlTree(['/authentication']);
};
