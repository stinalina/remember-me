import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { NotificationStore } from '@app/personal-space/data/notification.store';
import { INotification } from '@shared/utils/models/notification.model';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';

type PeriodStats = {
  created: number;
  due: number;
};

type TimelineEntry = {
  id: string;
  title: string;
  date: Date | null;
  formattedDate: string;
};

@Component({
  selector: 'reme-personal-stats',
  templateUrl: './stats.component.html',
  imports: [ContentFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  private readonly notificationStore = inject(NotificationStore);
  private readonly auth = inject(Auth);

  protected readonly periodCards = computed(() => {
    const stats = this.periodStats();
    return [
      { key: 'month', title: 'Diesen Monat', ...stats.month },
      { key: 'year', title: 'Dieses Jahr', ...stats.year },
      { key: 'total', title: 'Insgesamt', ...stats.total },
    ];
  });

  protected readonly currentDraftCount = computed(
    () => (this.notificationStore.value() ?? []).filter((note) => note.isDraft).length,
  );

  protected readonly currentTodoCount = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (this.notificationStore.value() ?? []).filter((note) => {
      const dueDate = this.parseDate(note.dueDate);
      if (!dueDate) {
        return false;
      }
      return !note.isDraft && !note.isArchived && dueDate >= today;
    }).length;
  });

  protected readonly timelineEntries = computed<TimelineEntry[]>(() => {
    const notes = this.notificationStore.value() ?? [];
    const firstCreated = this.findFirstByDate(notes, (note) => note.createdAt);
    const firstDue = this.findFirstByDate(
      notes.filter((note) => !note.isDraft),
      (note) => note.dueDate,
    );

    const memberSince = this.parseDate(this.auth.currentUser?.metadata.creationTime ?? null)
      ?? firstCreated?.date
      ?? null;

    return [
      {
        id: 'member-since',
        title: 'Beigetreten',
        date: memberSince,
        formattedDate: this.formatDate(memberSince),
      },
      {
        id: 'first-created-note',
        title: 'Erste Note erstellt',
        date: firstCreated?.date ?? null,
        formattedDate: this.formatDate(firstCreated?.date ?? null),
      },
      {
        id: 'first-due-note',
        title: 'Erste Note zugestellt',
        date: firstDue?.date ?? null,
        formattedDate: this.formatDate(firstDue?.date ?? null),
      },
    ];
  });

  private readonly periodStats = computed(() => {
    const notes = this.notificationStore.value() ?? [];
    const now = new Date();

    const isInCurrentMonth = (date: Date | null): boolean => {
      if (!date) {
        return false;
      }

      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    };

    const isInCurrentYear = (date: Date | null): boolean => {
      if (!date) {
        return false;
      }

      return date.getFullYear() === now.getFullYear();
    };

    const createdDates = notes.map((note) => this.parseDate(note.createdAt));
    const dueDates = notes
      .filter((note) => !note.isDraft)
      .map((note) => this.parseDate(note.dueDate));

    return {
      month: {
        created: createdDates.filter((date) => isInCurrentMonth(date)).length,
        due: dueDates.filter((date) => isInCurrentMonth(date)).length,
      } satisfies PeriodStats,
      year: {
        created: createdDates.filter((date) => isInCurrentYear(date)).length,
        due: dueDates.filter((date) => isInCurrentYear(date)).length,
      } satisfies PeriodStats,
      total: {
        created: notes.length,
        due: dueDates.filter((date) => date !== null).length,
      } satisfies PeriodStats,
    };
  });

  private parseDate(value: string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  private formatDate(date: Date | null): string {
    if (!date) {
      return '--.--.----';
    }

    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  private findFirstByDate(
    notes: INotification[],
    dateSelector: (note: INotification) => string,
  ): { note: INotification; date: Date } | null {
    let earliest: { note: INotification; date: Date } | null = null;

    for (const note of notes) {
      const date = this.parseDate(dateSelector(note));
      if (!date) {
        continue;
      }

      if (!earliest || date < earliest.date) {
        earliest = { note, date };
      }
    }

    return earliest;
  }
}
