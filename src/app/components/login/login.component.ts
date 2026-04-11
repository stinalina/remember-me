import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { AuthenticationService } from '@app/services/authentication.service';
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
  
  private readonly authenticationService = inject(AuthenticationService);
}