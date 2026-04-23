import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { INotification } from '@app/personal-space/data/notification.model';
import { SafeHtmlPipe } from '@shared/pipe/safe-html.pipe';

@Component({
  selector: 'reme-notification',
  templateUrl: './notification.html',
  imports: [
    CommonModule,
    SafeHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  public readonly notification = input.required<INotification>();
}
