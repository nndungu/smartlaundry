import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../constants/user-roles';

export const clientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    take(1),
    map(user => {
      if (user && user.role === UserRole.CUSTOMER) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};
