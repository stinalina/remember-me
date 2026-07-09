import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NotificationStore } from '@app/personal-space/data/notification.store';
import { Navbar, NotesFilterChangedEvent } from '@app/personal-space/home/notes/navbar/navbar';
import { NotificationEditorDialog as NotificationDialog } from '@app/personal-space/home/notes/notification-editor/notification-editor.dialog';
import { NotificationComponent } from '@app/personal-space/home/notes/notification/notification.component';
import { AdjustGridColumnsDirective } from '@app/personal-space/utils/adjust-grid-columns.directive';
import { MemberService } from '@app/personal-space/utils/member.service';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';
import { Utils } from '@shared/utils/utils';
import { Notification_Insert_Input } from '@root/src/graphql/generated';
import { NotificationService } from '@shared/services/notification.service';
import { INotification } from '@shared/utils/models/notification.model';
import { RangePipe } from '@shared/utils/pipe/range.pipe';
import { filter, switchMap, tap } from 'rxjs';

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
  private readonly notificationService = inject(NotificationService);
  private readonly memberService = inject(MemberService);

  protected readonly todayDate = new Date();

  protected readonly searchTerm = signal('');
  protected readonly draftsOnly = signal(false);
  protected readonly archivedOnly = signal(false);

  protected readonly displayedNotifications = computed(() => {
    const notifications = this.notificationStore.value() ?? [];
    const term = this.searchTerm().trim().toLowerCase();
    const onlyDrafts = this.draftsOnly();
    const onlyArchived = this.archivedOnly();

    const filteredNotes = notifications.filter((notification) => {
      if (onlyDrafts && !notification.isDraft) {
        return false;
      }

      if (onlyArchived && !notification.isArchived) {
        return false;
      }

      return true;
    });

    if (!term) {
      return filteredNotes;
    }

    return filteredNotes
      .filter((notification) => {
        const subject = notification.subject.toLowerCase();
        const content = notification.content.toLowerCase();
        return subject.includes(term) || content.includes(term);
      })
      .sort((a, b) => a.subject.localeCompare(b.subject, undefined, { sensitivity: 'base' }));
  });

  protected onSearchChanged(filter: NotesFilterChangedEvent): void {
    this.searchTerm.set(filter.searchTerm);
    this.draftsOnly.set(filter.draftsOnly);
    this.archivedOnly.set(filter.archivedOnly);
  }

  protected openCreateNoteModal(): void {
    NotificationDialog.open(this.dialog, 'create', undefined, this.memberService.member()!.preferences.defaultMail)
      .subscribe((result: INotification | undefined) => {
        if (result) {
          this.memberService.increaseStatsCount().subscribe();
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

  protected duplicateNotification(notification: INotification): void {
    const today = new Date();
    const isPast = new Date(notification.dueDate) < today;
    const duplicatedNote = {
      Subject: notification.subject ,
      Content: notification.content,
      DueDate: isPast ? Utils.tomorrow : notification.dueDate,
      IsDraft: false,
      IsArchived: false,
      UserId: this.memberService.member()!.id,
      Mail: notification.mail,
    } satisfies Notification_Insert_Input;

    this.notificationService.createNotification(duplicatedNote).pipe(
      filter((createdNotification): createdNotification is INotification => createdNotification !== undefined),
      tap(createdNotification => this.notificationStore.insertNotification(createdNotification)),
      switchMap(() => this.memberService.increaseStatsCount()),
    ).subscribe();
  }
}
