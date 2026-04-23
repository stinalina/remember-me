import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationStore } from '@app/personal-space/data/notification.store';
import { ContentFrameComponent } from '@app/shared/content-frame/content-frame.component';
import { Notification } from "./notification/notification";

@Component({
  selector: 'reme-personal-notes',
  templateUrl: './notes.component.html',
  imports: [
    CommonModule,
    ContentFrameComponent,
    Notification,
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent {
  protected readonly notificationStore = inject(NotificationStore);
}
