import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';
import { NotificationEditorComponent } from '@app/shared/feature/create-notification/notification-editor.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-free-notification',
  templateUrl: 'free-notification.component.html',
  imports: [
    NotificationEditorComponent,
    ContentFrameComponent,
],
})
export class FreeNotificationComponent {
  public readonly requestRegistration = output<void>();
}