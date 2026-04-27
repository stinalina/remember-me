import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn, Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { MemberService } from '@app/personal-space/utils/member.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { UserService } from '@app/services/user.service';
import { IUser } from '@shared/models';
import { EMPTY } from 'rxjs';
import { catchError, filter, switchMap, timeout, first } from 'rxjs/operators';

export const memberResolver: ResolveFn<void> = () => {
  const toastService = inject(ToastService);
  const userService = inject(UserService);
  const memberService = inject(MemberService);
  const router = inject(Router);

  return toObservable(userService.currUser).pipe(
    filter((user): user is IUser => user !== null),
    first(),
    timeout(3_000),
    catchError((error) => {
      toastService.showToast(error.message, ToastType.Error);
      router.navigate([ROUTER_TOKENS.LOGIN]);
      return EMPTY;
    }),
    switchMap(user => memberService.loadMember(user.userId)),
    catchError((error) => {
      toastService.showToast(error.message, ToastType.Error);
      router.navigate([ROUTER_TOKENS.LOGIN]);
      return EMPTY;
    }),
  );
};
