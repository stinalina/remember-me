import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '@app/services/authentication.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { ContentFrameComponent } from '@app/shared/content-frame/content-frame.component';
import { CheckboxComponent } from '@app/shared/input/checkbox/checkbox.component';
import { MailComponent } from '@app/shared/mail/mail.component';
import { PasswordComponent } from '@app/shared/password/password.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-login',
  templateUrl: 'login.component.html',
  imports: [
    CheckboxComponent,
    ContentFrameComponent,
    MailComponent,
    PasswordComponent
  ],
})
export class LoginComponent {
  public readonly requestRegistration = output<void>();

  protected readonly authenticationService = inject(AuthenticationService);
  private readonly toastService = inject(ToastService)
  private readonly destroyRef = inject(DestroyRef);

  protected errorMessage: string | null = null;
  protected rememberMeFlag = true;

  public login(mail: string, password: string, rememberMe: boolean): void {
    this.errorMessage = null;

    if (!mail || !password) {
      this.toastService.showToast('Bitte geben Sie eine gültige E-Mail und ein Passwort ein.', ToastType.Warning);
      return;
    }

    this.authenticationService.signIn(mail, password, rememberMe).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      // redirect handled by auth guard or to personal space
    );
  }
}