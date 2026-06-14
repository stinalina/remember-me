import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NotificationStore } from '@app/personal-space/data/notification.store';
import { Navbar } from '@app/personal-space/home/notes/navbar/navbar';
import { AdjustGridColumnsDirective } from '@app/personal-space/utils/adjust-grid-columns.directive';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';
import { RangePipe } from '@app/shared/utils/pipe/range.pipe';
import { NotificationComponent } from "./notification/notification.component";
import { NotificationEditorDialog as NotificationDialog } from '@app/personal-space/home/notes/notification-editor/notification-editor.dialog';
import { INotification } from '@app/shared/utils/models/notification.model';
import { NotesFilterChangedEvent } from '@app/personal-space/home/notes/navbar/navbar';

@Component({
  selector: 'reme-personal-notes',
  templateUrl: './notes.component.html',
  imports: [
    CommonModule,
    ContentFrameComponent,
    Navbar,
    NgTemplateOutlet,
    NotificationComponent,
    RangePipe,
    AdjustGridColumnsDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent {
  protected readonly dialog = inject(Dialog);
  protected readonly notificationStore = inject(NotificationStore);

  protected readonly todayDate = new Date();

  protected readonly searchTerm = signal('');
  protected readonly draftsOnly = signal(false);
  protected readonly archivedOnly = signal(false);

  protected readonly displayedNotifications = computed(() => {
    const notifications = this.notificationStore.value() ?? [];
    const term = this.searchTerm().trim().toLowerCase();
    const onlyDrafts = this.draftsOnly();
    const onlyArchived = this.archivedOnly();

    const filteredByState = notifications.filter((notification) => {
      if (onlyDrafts && !notification.isDraft) {
        return false;
      }

      if (onlyArchived && !notification.isArchived) {
        return false;
      }

      return true;
    });

    if (!term) {
      return filteredByState;
    }

    return filteredByState
      .filter((notification) => notification.subject.toLowerCase().includes(term))
      .sort((a, b) => a.subject.localeCompare(b.subject, undefined, { sensitivity: 'base' }));
  });

  protected onSearchChanged(filter: NotesFilterChangedEvent): void {
    this.searchTerm.set(filter.searchTerm);
    this.draftsOnly.set(filter.draftsOnly);
    this.archivedOnly.set(filter.archivedOnly);
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
