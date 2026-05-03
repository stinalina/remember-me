import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { InsertNotificationGQL, InsertNotificationMutationVariables } from "@hasura/generated";
import { ICreateNotification, IUser } from "@shared/models";
import { catchError, map, Observable, of } from 'rxjs';
import { ToastService, ToastType } from "./toast.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  
  private readonly insertNotificationGQL = inject(InsertNotificationGQL);
  
  /**
   * Inserts notification and send email.
   * @param notification 
   * @returns a bollean indicating whether the operation was successful.
   */
  public createNotification(notification: ICreateNotification, user: IUser): Observable<boolean> {
    const variables: InsertNotificationMutationVariables = {
      objects: [
        {
          Content: notification.content,
          DueDate: notification.dueDate,
          UserId: user.userId,
          Subject: notification.subject
        }
      ]
    };
    return this.insertNotificationGQL.mutate({variables}).pipe(
      takeUntilDestroyed(this.destroyRef),
      map(() => {
        if (user.newCreated === true) {
          this.sendWelcomeMail(user);
        }
        this.toastService.showToast('Notification created successfully!', ToastType.Success);
        return true;
      }),
      catchError((error) => {
        console.error(`Error inserting notification: ${JSON.stringify(error)}`);
        this.toastService.showToast('Oh nein! Das hat leider nicht geklappt!', ToastType.Error);
        return of(false);
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
