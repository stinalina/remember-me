import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NotificationStore } from '@app/personal-space/data/notification.store';
import { Navbar } from '@app/personal-space/home/notes/navbar/navbar';
import { ContentFrameComponent } from '@app/shared/content-frame/content-frame.component';
import { RangePipe } from '@app/shared/utils/pipe/range.pipe';
import { NotificationComponent } from "./notification/notification.component";
import { NotificationEditorDialog as NotificationDialog } from '@app/personal-space/home/notes/notification-editor/notification-editor.dialog';
import { INotification } from '@app/shared/models/notification.model';

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
  protected readonly searchTerm = signal('');

  protected readonly displayedNotifications = computed(() => {
    const notifications = this.notificationStore.value() ?? [];
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return notifications;
    }

    return notifications
      .filter((notification) => notification.subject.toLowerCase().includes(term))
      .sort((a, b) => a.subject.localeCompare(b.subject, undefined, { sensitivity: 'base' }));
  });

  /** Ghost cards needed to fill the last partial grid row */
  protected readonly trailingGhostCount = computed(() => {
    const n = this.displayedNotifications().length + 1; // +1 for create placeholder
    return (3 - (n % 3)) % 3;
  });

  protected onSearchChanged(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
  }

  protected openCreateNoteModal(): void {
    NotificationDialog.open(this.dialog, 'create').subscribe((result: INotification | undefined) => {
      if (result) {
        this.notificationStore.insertNotification(result);
      }
      else {
        // Creation aborted
      }
    });
  }

  protected openEditNoteModal(notification: INotification): void {
    NotificationDialog.open(this.dialog, 'edit', notification).subscribe((result: INotification | undefined) => {
      if (result) {
        this.notificationStore.updateNotification(result);
      }
      else {
        // Edit aborted
      }
    });
  }
}
