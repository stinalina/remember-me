import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { INotification } from '@app/personal-space/data/notification.model';
import { SafeHtmlPipe } from '@shared/pipe/safe-html.pipe';

@Component({
  selector: 'reme-notification',
  templateUrl: './notification.component.html',
  imports: [
    CommonModule,
    SafeHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  public readonly notification = input.required<INotification>();
  public readonly deleteNotification = output<string>();
}
