import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '@app/services/authentication.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { ContentFrameComponent } from '@app/shared/content-frame/content-rame.component';
import { CheckboxComponent } from '@app/shared/input/checkbox/checkbox.component';
import { MailComponent } from '@app/shared/mail/mail.component';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { PasswordComponent } from '@app/shared/password/password.component';
import { TextFrameComponent } from '@app/shared/text-frame/text-frame.component';
import * as dsgvo from '@assets/text/dsgvo.txt';

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
  private readonly authenticationService = inject(AuthenticationService);
  private readonly toastService = inject(ToastService)
  private readonly destroyRef = inject(DestroyRef);
  protected readonly DsgvoText = dsgvo.default;
  
  protected errorMessage: string | null = null;
  protected acceptDsgvoFlag = false;

  constructor() {
    effect(() => console.log(`Checkbox value changed: ${this.acceptDsgvoFlag}`));
  }

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

    this.authenticationService.signUp(mail, password).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
        // TODO route to personal space or use routing guard
      }
    );
  }
}