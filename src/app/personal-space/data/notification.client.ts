import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { INotification } from "@app/personal-space/data/notification.model";
import { UserService } from "@app/services/user.service";
import { DeleteNotificationByIdGQL, GetNotificationByUserIdGQL, InsertNotificationGQL, Notification_Insert_Input } from "@hasura/generated";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NotificationClient {
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);

  private readonly deleteNotificationByIdGQL = inject(DeleteNotificationByIdGQL);
  private readonly getNotificationByUserIdGQL = inject(GetNotificationByUserIdGQL);
  private readonly insertNotificationGQL = inject(InsertNotificationGQL);

  public loadNotifications(): Observable<INotification[]> {
    const userId = this.userService.currUser()?.userId;
    if (!userId) {
      console.error('No user logged in. Cannot load notifications.');
      return of([]);
    }
    return this.getNotificationByUserIdGQL.fetch({variables: {userId }}).pipe(
      takeUntilDestroyed(this.destroyRef),
      map(result => result.data?.['Notification']?.map(n => ({
        id: n.Id,
        subject: n.Subject,
        content: n.Content,
        dueDate: n.DueDate,
        createdAt: n.CreatedAt
      } satisfies INotification)) ?? []),
      catchError(error => {
        console.error('Error loading notifications:', error);
        return of([]);
      })
    );
  }

  public deleteNotification(id: string): Observable<boolean> {
    return this.deleteNotificationByIdGQL.mutate({ variables: { id } }).pipe(
      takeUntilDestroyed(this.destroyRef),
      map(result => Boolean(result.data?.delete_Notification_by_pk)),
      catchError(error => {
        console.error('Error deleting notification:', error);
        return of(false);
      })
    );
  }
    
  public insertNotification(notification: INotification): Observable<boolean> {
    const userId = this.userService.currUser()?.userId;
    if (!userId) {
      console.error('No user logged in. Can not insert notifications.');
      return of(false);
    }

    const notificationInput = {
      Content: notification.content,
      DueDate: notification.dueDate,
      Subject: notification.subject,
      UserId: userId
    } satisfies Notification_Insert_Input;

    return this.insertNotificationGQL.mutate({ variables: { objects: notificationInput}}).pipe(
      takeUntilDestroyed(this.destroyRef),
      map(result => Boolean(result.data?.insert_Notification)),
      catchError(error => {
        console.error('Error inserting notification:', error);
        return of(false);
      })
    );
  }
}