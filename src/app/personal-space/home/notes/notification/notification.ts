import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { INotification } from '@app/personal-space/data/notification.model';

@Component({
  selector: 'reme-notification',
  templateUrl: './notification.html',
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notification {
  public readonly notification = input.required<INotification>();
}
