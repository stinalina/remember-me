import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NotificationStore } from '@app/personal-space/data/notification.store';
import { Navbar } from '@app/personal-space/home/notes/navbar/navbar';
import { ContentFrameComponent } from '@app/shared/content-frame/content-frame.component';
import { RangePipe } from '@app/shared/pipe/range.pipe';
import { NotificationComponent } from "./notification/notification.component";
import { CreateNotificationDialog } from '@app/personal-space/home/notes/create-notification/create-notification.dialog';

@Component({
  selector: 'reme-personal-notes',
  templateUrl: './notes.component.html',
  imports: [
    CommonModule,
    ContentFrameComponent,
    Navbar,
    NgTemplateOutlet,
    NotificationComponent,
    RangePipe
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent {
  protected readonly todayDate = new Date();
  protected readonly dialog = inject(Dialog);
  protected readonly notificationStore = inject(NotificationStore);

  /** Ghost cards needed to fill the last partial grid row */
  protected readonly trailingGhostCount = computed(() => {
    const n = (this.notificationStore.value()?.length ?? 0) + 1; // +1 for create placeholder
    return (3 - (n % 3)) % 3;
  });

  protected openCreateNoteModal(): void {
    CreateNotificationDialog.open(this.dialog);
  }
}
