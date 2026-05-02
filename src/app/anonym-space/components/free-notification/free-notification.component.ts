import { ContentFrameComponent } from '../../../shared/content-frame/content-frame.component';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CreateNotificationComponent } from '@shared/create-notification/create-notification.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-free-notification',
  templateUrl: 'free-notification.component.html',
  imports: [
    CreateNotificationComponent,
    ContentFrameComponent
  ],
})
export class FreeNotificationComponent {
  public readonly requestRegistration = output<void>();
}