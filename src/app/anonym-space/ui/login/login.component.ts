import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MailComponent } from '@app/anonym-space/ui/shared/mail/mail.component';
import { PasswordComponent } from '@app/anonym-space/ui/shared/password/password.component';
import { ROUTER_TOKENS } from '@app/app.routes';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';
import { ToastService, ToastType } from '@services/toast.service';
import { AuthService } from '@shared/utils/authentication/auth.service';
import { CheckboxComponent } from '@shared/utils/checkbox/checkbox.component';

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

  protected readonly isLoading = signal(false);
  protected rememberMeFlag = true;

  public login(mail: string, password: string, rememberMe: boolean): void {
    if (!mail || !password) {
      this.toastService.showToast('Bitte gib eine gültige E-Mail und ein Passwort ein.', ToastType.Warning);
      return;
    }

    this.isLoading.set(true);
    this.authenticationService.signIn(mail, password, rememberMe).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(success => {
      this.isLoading.set(false);
      if (success) {
        this.router.navigate([ROUTER_TOKENS.HOME]);
      }
  });
  }

  public forgetPassword(mail: string | null): void {
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
