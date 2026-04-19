import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ROUTER_TOKENS } from '@app/app.routes';
import { AuthService } from '@app/shared/authentication/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const authService = inject(AuthService);

  await auth.authStateReady();

  // router.navigate gibt ein Promise zurück, was hier nicht gewünscht ist
  return authService.isAuthenticated() || router.createUrlTree([ROUTER_TOKENS.LOGIN]);
};