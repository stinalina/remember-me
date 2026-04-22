import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserService } from '@app/services/user.service';
import { IUser } from '@shared/models';
import { filter, first, timeout, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ROUTER_TOKENS } from '@app/app.routes';

export const userResolver: ResolveFn<IUser> = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return toObservable(userService.currUser).pipe(
    filter((user): user is IUser => user !== null),
    first(),
    timeout(3_000),
    catchError(() => {
      router.navigate([ROUTER_TOKENS.LOGIN]);
      return EMPTY;
    })
  );
};
