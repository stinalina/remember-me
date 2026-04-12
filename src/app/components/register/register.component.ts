import { Component, DestroyRef, effect, inject, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { AuthenticationService } from '@app/services/authentication.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { CheckboxComponent } from '@app/shared/input/checkbox/checkbox.component';
import { MailComponent } from '@app/shared/mail/mail.component';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { PasswordComponent } from '@app/shared/password/password.component';
import { TextFrameComponent } from '@app/shared/text-frame/text-frame.component';
import * as dsgvo from '@assets/text/dsgvo.txt';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'reme-register',
  templateUrl: 'register.component.html',
  imports: [
    CheckboxComponent,
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
  private readonly router = inject(Router);
  
  protected readonly DsgvoText = dsgvo.default;
  
  protected errorMessage: string | null = null;
  protected acceptDsgvoFlag: boolean = false;

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
    ).subscribe(() => { //Das ist wohl ein auto login by default... so navigate to personal space or home
        this.router.navigate([ROUTER_TOKENS.LOGIN]);
      }
    );
  }
}