import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@shared/utils/authentication/auth.service";
import { environment } from "@environments/environment";
import { Observable, switchMap } from "rxjs";

export function authHasuraInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (!req.url.startsWith(environment.HASURA_URL)) {
    return next(req);
  }

  if (environment.HASURA_ADMIN_SECRET) {
    const adminSecretReq = req.clone({
      headers: req.headers.set('x-hasura-admin-secret', environment.HASURA_ADMIN_SECRET),
    });
    return next(adminSecretReq);
  }

  const authService = inject(AuthService);
  return authService.getIdToken().pipe(
      switchMap(token => {
        if (token) {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next(cloned);
        }
        return next(req);
      })
    );
}