import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { NotificationService } from '@app/services/notification.service';
import { UserService } from '@app/services/user.service';
import { ContentFrameComponent } from '@app/shared/content-frame/content-frame.component';
import { ICreateNotification, IUser } from '@app/shared/models';
import { CreateNotificationComponent } from '@shared/create-notification/create-notification.component';
import { Observable, delay, map, switchMap } from 'rxjs';
import { CdkObserveContent } from "@angular/cdk/observers";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-free-notification',
  templateUrl: 'free-notification.component.html',
  imports: [
    CreateNotificationComponent,
    ContentFrameComponent,
    CdkObserveContent
],
})
export class FreeNotificationComponent {
  public readonly requestRegistration = output<void>();

  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  protected createNotification(notification: ICreateNotification): Observable<void> {
    return this.userService.getUserByMailOrCreateUserIfNotExists(notification.mail).pipe(
      delay(500), // prevent race condition when new user is created and immediately receives a notification
      switchMap((user: IUser) => this.notificationService.createNotification(notification, user)),
      map(() => undefined)
    )
  }
}