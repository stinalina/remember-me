import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { ToastService, ToastType } from '@services/toast.service';
import { AuthService } from '@shared/utils/authentication/auth.service';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';
import { CheckboxComponent } from '@shared/utils/checkbox/checkbox.component';
import { MailComponent } from '@app/anonym-space/ui/shared/mail/mail.component';
import { PasswordComponent } from '@app/anonym-space/ui/shared/password/password.component';

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
      this.toastService.showToast('Bitte gib eine gültige E-Mail und ein Passwort ein.', ToastType.Warning);
      return;
    }

    this.authenticationService.signIn(mail, password, rememberMe).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      () => this.router.navigate([ROUTER_TOKENS.HOME])
    );
  }

  public forgetPassword(mail: string | null): void {
    this.errorMessage = null;

    if (!mail) {
      this.toastService.showToast('Bitte gib eine gültige E-Mail ein.', ToastType.Warning);
      return;
    }
    
    this.authenticationService.resetPassword(mail).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(
      () => this.toastService.showToast('Anweisungen zum Zurücksetzen des Passworts wurden an deine E-Mail gesendet (falls vorhanden).', ToastType.Info)
    );
  }
}
