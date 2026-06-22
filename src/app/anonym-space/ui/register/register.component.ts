import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MailComponent } from '@app/anonym-space/ui/shared/mail/mail.component';
import { PasswordComponent } from '@app/anonym-space/ui/shared/password/password.component';
import { ROUTER_TOKENS } from '@app/app.routes';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';
import { ToastService, ToastType } from '@services/toast.service';
import { AuthService } from '@shared/utils/authentication/auth.service';
import { CheckboxComponent } from '@shared/utils/checkbox/checkbox.component';
import { catchError, EMPTY } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-register',
  templateUrl: 'register.component.html',
  imports: [
    CheckboxComponent,
    ContentFrameComponent,
    MailComponent,
    PasswordComponent,
  ],
})
export class RegisterComponent {
  private readonly authenticationService = inject(AuthService);
  private readonly toastService = inject(ToastService)
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  
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
        this.isLoading.set(false);
        return EMPTY;
      }),
      // finalize(() => this.isLoading.set(false)) intentionally not used, da wir auch während der Weiterleitung noch isLoading true haben wollen
    ).subscribe(() => {
      this.toastService.showToast('Registrierung erfolgreich! Du wirst nun weitergeleitet.', ToastType.Success);
      this.router.navigate([ROUTER_TOKENS.HOME]);
    });
  }
}