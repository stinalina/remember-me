import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { AuthService } from '@app/shared/authentication/auth.service';

export const authGuard: CanActivateFn = async () => {
  return inject(AuthService).isAuthenticated() 
    || inject(Router).createUrlTree([ROUTER_TOKENS.LANDING_PAGE]);
    // router.naviagte gibt ein Promise zurück, was hier nicht gewünscht ist
};