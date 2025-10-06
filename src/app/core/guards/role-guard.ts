import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { inject } from '@angular/core';
import { Role } from '../interfaces/role-type';

/**
 * Role-based route guard.
 * Checks if the authenticated user's role is included in the list of roles
 * specified in the route's data. If the user lacks the required role,
 * they are redirected to the '/not-authorized' page.
 *
 * @param route - The activated route snapshot
 * @param state - The router state snapshot
 * @returns true if the user has one of the required roles; otherwise false
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthenticationService);
  const router = inject(Router);

  // Retrieve expected roles from route data
  const exceptedRoles = route.data['roles'] as Role[];
  // Get the current user's role
  const userRole = service.getUserRole();

  // Allow access if the user has one of the required roles
  if (userRole && exceptedRoles.some((role) => userRole.includes(role))) {
    return true;
  }

  // Redirect to not-authorized page if role check fails
  router.navigate(['/not-authorized']);
  return false;
};
