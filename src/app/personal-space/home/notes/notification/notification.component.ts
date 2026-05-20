import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { INotification } from '@app/personal-space/data/notification.model';
import { ConfirmDialog } from '@app/shared/confirmation-dialog/confirmation.dialog';
import { SafeHtmlPipe } from '@shared/pipe/safe-html.pipe';

@Component({
  selector: 'reme-notification',
  templateUrl: './notification.component.html',
  imports: [
    CommonModule,
    ConfirmDialog,
    SafeHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  public readonly notification = input.required<INotification>();
  public readonly deleteNotification = output<void>();
  public readonly editClicked = output<void>();
  public readonly preId = input<string>();

  protected readonly isDuePast = computed(() => {
    const today = new Date();
    return new Date(this.notification().dueDate) < today;
  });
}
