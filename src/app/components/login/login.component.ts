import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { CheckboxComponent } from '@app/shared/input/checkbox/checkbox.component';
import { MailComponent } from '@app/shared/mail/mail.component';
import { PasswordComponent } from '@app/shared/password/password.component';

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
}