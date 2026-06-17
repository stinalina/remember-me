import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { NotificationStore } from '@app/personal-space/data/notification.store';
import { INotification } from '@shared/utils/models/notification.model';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MemberService } from '@root/src/app/personal-space/utils/member.service';

type TimelineEntry = {
  id: string;
  title: string;
  date: Date | null;
  description?: string;
};

type PeriodCard = {
  key: string;
  title: string;
  count: number;
  interactive?: boolean;
};

type MonthStat = {
  key: string;
  title: string;
  count: number;
};

@Component({
  selector: 'reme-personal-stats',
  templateUrl: './stats.component.html',
  imports: [
    ContentFrameComponent,
    DatePipe,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  private readonly notificationStore = inject(NotificationStore);
  private readonly memberService = inject(MemberService);
  private readonly auth = inject(Auth);
  private readonly datePipe = new DatePipe('de-DE');

  protected readonly currentYear = new Date().getFullYear();

  protected readonly periodCards = computed<PeriodCard[]>(() => {
    const stats = this.createdCount();
    return [
      { key: 'month', title: 'Diesen Monat', count: stats.month, interactive: true },
      { key: 'year', title: 'Dieses Jahr', count: stats.year },
      { key: 'total', title: 'Insgesamt', count: stats.total },
    ];
  });

  protected readonly monthStats = computed<MonthStat[]>(() => {
    const member = this.memberService.member();
    const yearStats = member?.stats?.[String(this.currentYear)] ?? {};

    return Array.from({ length: 12 }, (_, index) => {
      const monthNumber = String(index + 1).padStart(2, '0');
      const monthTitle = this.datePipe.transform(new Date(this.currentYear, index, 1), 'MMMM') ?? '';

      return {
        key: monthNumber,
        title: monthTitle,
        count: yearStats[monthNumber] ?? 0,
      };
    });
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
      },
      {
        id: 'first-created-note',
        title: 'Erste Note erstellt',
        description: firstCreated?.note.subject ?? undefined,
        date: firstCreated?.date ?? null,
      },
      {
        id: 'first-due-note',
        title: 'Erste Note zugestellt',
        description: firstDue?.note.subject ?? undefined,
        date: firstDue?.date ?? null,
      },
    ];
  });

  private readonly createdCount = computed(() => {
    const member = this.memberService.member();
    if (!member) {
      console.error('Member is missing. Stats only available for logged in users.');
      return {
        month: 0,
        year: 0,
        total: 0
      };
    }
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

    return {
      month: member.stats[currentYear]?.[currentMonth] ?? 0,
      year: member.stats[currentYear] ? Object.values(member.stats[currentYear]).reduce((sum, count) => sum + count, 0) : 0,
      total: member.stats ? Object.values(member.stats).reduce((yearSum, year) => yearSum + Object.values(year).reduce((monthSum, count) => monthSum + count, 0), 0) : 0,
    };
  });

  private parseDate(value: string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
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
