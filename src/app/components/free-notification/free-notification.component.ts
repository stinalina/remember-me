import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { CreateNotificationComponent } from '@shared/create-notification/create-notification.component';

@Component({
  selector: 'reme-free-notification',
  templateUrl: 'free-notification.component.html',
  imports: [
    CreateNotificationComponent,
    RouterLink
  ],
})
export class FreeNotificationComponent {
  public readonly RouterTokens = ROUTER_TOKENS;
}