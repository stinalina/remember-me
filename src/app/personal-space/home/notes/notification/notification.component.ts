import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { ConfirmDialog } from '@app/personal-space/ui/confirmation-dialog/confirmation.dialog';
import { SafeHtmlPipe } from '@shared/utils/pipe/safe-html.pipe';
import { INotification } from '@shared/utils/models/notification.model';

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
  public readonly updateNotificationRequested = output<void>();
  public readonly preId = input<string>();

  protected readonly isDuePast = computed(() => {
    const notification = this.notification();
    const today = new Date();
    return !notification.isDraft && !notification.isArchived && new Date(notification.dueDate) < today;
  });
  
  protected readonly showOverdueWarning = computed(() => this.isDuePast() && !this.notification().isArchived);

  protected updateArchiveState(): void {
    this.notification().isArchived = true;
    this.updateNotificationRequested.emit();
  }
}
