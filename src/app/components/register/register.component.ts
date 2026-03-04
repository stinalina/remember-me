import { Component } from '@angular/core';
import { ROUTER_TOKENS } from '@app/app.routes';
import { CheckboxComponent } from '@app/shared/input/checkbox/checkbox.component';
import { MailComponent } from '@app/shared/mail/mail.component';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { PasswordComponent } from '@app/shared/password/password.component';
import { TextFrameComponent } from '@app/shared/text-frame/text-frame.component';
import * as agb from '@assets/text/agb.txt';
import * as dsgvo from '@assets/text/dsgvo.txt';

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
  public readonly AgbText = agb.default;
  public readonly DsgvoText = dsgvo.default;
}