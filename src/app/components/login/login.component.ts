import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { BackendUtilsService } from '@app/services/backend-utils.service';
import { NotificationService } from '@app/services/notification.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { CheckboxComponent } from '@app/shared/input/checkbox/checkbox.component';
import { MailComponent } from '@app/shared/mail/mail.component';
import { PasswordComponent } from '@app/shared/password/password.component';
import { environment } from '@environments/environment';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'reme-login',
  templateUrl: 'login.component.html',
  imports: [
    CheckboxComponent,
    MailComponent,
    PasswordComponent,
    RouterLink
  ],
})
export class LoginComponent {
  public readonly RouterTokens = ROUTER_TOKENS;
  public readonly MVP_Mode = environment.MVP_Mode;
  
  private readonly notificationService = inject(NotificationService);
  private readonly backendUtilsService = inject(BackendUtilsService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef); 

  public readonly countOfInterestedParties = signal<number>(7);

  constructor() {
    this.backendUtilsService.getUserAsInterestedPartyCount().subscribe(
      (response) => this.countOfInterestedParties.set(response + 7)
    );
  }

  public registerUserForInterestedParty(mail: string | null): void {
    if (!this.MVP_Mode) {
      console.error('Method should be removed when no MVP Mode is necessary anymore');
      return;
    }

    if (!mail) {
      console.error('Mail is null. Cannot register user as interested party.');
      return;
    }

    this.notificationService.storeUserAsInterestedParty(mail).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError((error) => {
        this.toastService.showToast('Fehler beim Registrieren als Interessent. Bitte versuchen Sie es später erneut.', ToastType.Error);
        console.error(`Error registering user as interested party: ${JSON.stringify(error)}`);
        return EMPTY
      })
    ).subscribe((response) => {
      this.countOfInterestedParties.set(response + 7);
      this.toastService.showToast('Erfolgreich registriert! Wir halten dich auf dem Laufenden.', ToastType.Success);
    });
  }
}