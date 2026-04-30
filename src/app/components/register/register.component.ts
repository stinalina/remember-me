import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { ToastService, ToastType } from '@app/services/toast.service';
import { UserService } from '@app/services/user.service';
import { AuthService } from '@app/shared/authentication/auth.service';
import { ContentFrameComponent } from '@app/shared/content-frame/content-frame.component';
import { CheckboxComponent } from '@app/shared/input/checkbox/checkbox.component';
import { MailComponent } from '@app/shared/mail/mail.component';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { PasswordComponent } from '@app/shared/password/password.component';
import { TextFrameComponent } from '@app/shared/text-frame/text-frame.component';
import * as dsgvo from '@assets/text/dsgvo.txt';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-register',
  templateUrl: 'register.component.html',
  imports: [
    CheckboxComponent,
    ContentFrameComponent,
    MailComponent,
    ModalComponent,
    PasswordComponent,
    TextFrameComponent
  ],
})
export class RegisterComponent {
  private readonly authenticationService = inject(AuthService);
  private readonly toastService = inject(ToastService)
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly DsgvoText = dsgvo.default;
  
  protected readonly isLoading = signal<boolean>(false);
  protected errorMessage: string | null = null;
  protected acceptDsgvoFlag = false;

  public register(mail: string, password: string, passwordRepeat: string): void {
    this.errorMessage = null;

    if (!mail || !password) {
      this.toastService.showToast('Bitte geben Sie eine gültige E-Mail und ein Passwort ein.', ToastType.Warning);
      return;
    }

    if (password !== passwordRepeat) {
      this.errorMessage = 'Die Passwörter stimmen nicht überein.';
      return;
    }

    if (!this.acceptDsgvoFlag) {
      this.toastService.showToast('Bitte akzeptieren Sie die DSGVO, um fortzufahren.', ToastType.Warning);
      return;
    }

    this.isLoading.set(true);
    this.authenticationService.signUp(mail, password).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Registration error:', error);
        this.toastService.showToast('Registrierung fehlgeschlagen: ' + error.message, ToastType.Error);
        return EMPTY;
      }),
      switchMap(() => this.userService.addUserToDb(mail)),
      finalize(() => this.isLoading.set(false))
    ).subscribe(() => {
      this.toastService.showToast('Registrierung erfolgreich! Sie werden nun zum Login weitergeleitet.', ToastType.Success);
      this.router.navigate([ROUTER_TOKENS.LOGIN]);
    });
  }
}