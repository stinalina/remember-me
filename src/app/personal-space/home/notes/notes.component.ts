import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NotificationStore } from '@app/personal-space/data/notification.store';
import { ContentFrameComponent } from '@app/shared/content-frame/content-frame.component';
import { NotificationComponent } from "./notification/notification.component";
import { Navbar } from '@app/personal-space/home/notes/navbar/navbar';
import { RangePipe } from '@app/shared/pipe/range.pipe';

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
  protected readonly notificationStore = inject(NotificationStore);

  /** Ghost cards needed to fill the last partial grid row */
  protected readonly trailingGhostCount = computed(() => {
    const n = (this.notificationStore.value()?.length ?? 0) + 1; // +1 for create placeholder
    return (3 - (n % 3)) % 3;
  });
}
