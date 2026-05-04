import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { environment } from "@environments/environment";
import { InsertNotificationGQL, Notification_Insert_Input } from "@hasura/generated";
import { IUser } from "@shared/models";
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ToastService, ToastType } from "./toast.service";
import { INotification } from "@app/personal-space/data/notification.model";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  
  private readonly insertNotificationGQL = inject(InsertNotificationGQL);
  
  /**
   * Inserts notification and send email.
   * @param insertNotification 
   * @returns a bollean indicating whether the operation was successful.
   */
  public createNotification(insertNotification: Notification_Insert_Input, user: IUser): Observable<INotification | undefined> {
    return this.insertNotificationGQL.mutate({ variables: { objects: [insertNotification] }}).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => {
        if (user.newCreated === true) {
          this.sendWelcomeMail(user);
        }
        this.toastService.showToast('Notification created successfully!', ToastType.Success);
      }),
      map((result) => {
        const notification = result.data?.insert_Notification?.returning[0];
        if (!notification) {
          this.toastService.showToast('Error creating notification. Please try again.', ToastType.Error);
          return undefined;
        }
        return ({
          id: notification?.Id ?? '',
          subject: notification?.Subject ?? '',
          content: notification?.Content ?? '',
          dueDate: notification?.DueDate ?? '',
          createdAt: notification?.CreatedAt ?? '',
        }) satisfies INotification;
      }),
      catchError((error) => {
        console.error(`Error inserting notification: ${JSON.stringify(error)}`);
        this.toastService.showToast('Oh nein! Das hat leider nicht geklappt!', ToastType.Error);
        return of(undefined);
      })
    )
  }

  /**
   * subscribes to a post which sends a welcome mail. catchs the error and logs it.
   * @param user 
   */
  private sendWelcomeMail(user: IUser): void {
    const payload = {
      Mail: user.mail,
      Name: user.mail.split('@')[0]
    };

    const url = environment.BACKEND_URL + environment.SEND_WELCOME_MAIL_URL;
    this.httpClient.post(url, payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      error: (error) => console.error(`Error sending welcome email: ${JSON.stringify(error)}`)
    });
  }
}
