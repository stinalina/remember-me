import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { ToastService, ToastType } from '@app/services/toast.service';
import { AuthService } from '@app/shared/authentication/auth.service';
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

  protected readonly authenticationService = inject(AuthService);
  private readonly toastService = inject(ToastService)
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router); 

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
    )
    .subscribe(
      () => this.router.navigate([ROUTER_TOKENS.HOME])
    );
  }
}
