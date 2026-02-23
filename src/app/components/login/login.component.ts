import { Component } from '@angular/core';
import { MailComponent } from '@app/shared/mail/mail.component';
import { PasswordComponent } from '@app/shared/password/password.component';

@Component({
  selector: 'reme-login',
  templateUrl: 'login.component.html',
  imports: [
    MailComponent,
    PasswordComponent
  ],
})
export class LoginComponent {

}