import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { ConfirmDialog } from '@app/personal-space/components/confirmation-dialog/confirmation.dialog';
import { INotification } from '@app/shared/models/notification.model';
import { SafeHtmlPipe } from '@app/shared/utils/pipe/safe-html.pipe';

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
