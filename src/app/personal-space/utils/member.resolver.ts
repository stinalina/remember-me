import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ResolveFn, Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { MemberService } from '@app/personal-space/utils/member.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { UserService } from '@app/services/user.service';
import { EMPTY } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';

export const memberResolver: ResolveFn<void> = () => {
  const toastService = inject(ToastService);
  const userService = inject(UserService);
  const memberService = inject(MemberService);
  const router = inject(Router);
  const auth = inject(Auth);

  const currentUser = auth.currentUser;
  if (!currentUser?.email) {
    router.navigate([ROUTER_TOKENS.LOGIN]);
    return EMPTY;
  }

  // wenn wir nicht bereits mit firebase authentifiziert wurden, kommen wir hier auch nicht hin
  // Im Falle der Neuregestrierung müssen wir den User neu erstellen.
  return userService.getUserByMailOrCreateUserIfNotExists(currentUser.email).pipe(
    timeout(5_000),
    catchError((error) => {
      toastService.showToast('Fehler beim Laden der Benutzerdaten: ' + error.message, ToastType.Error);
      router.navigate([ROUTER_TOKENS.LOGIN]);
      return EMPTY;
    }),
    switchMap(user => memberService.loadMember(user.userId)),
    catchError((error) => {
      toastService.showToast('Fehler beim Laden des Users: ' + error.message, ToastType.Error);
      router.navigate([ROUTER_TOKENS.LOGIN]);
      return EMPTY;
    }),
  );
};
