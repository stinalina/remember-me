import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { INotification } from "@shared/utils/models/notification.model";
import { IUser } from "@shared/utils/models/user.model";
import { environment } from "@environments/environment";
import { DeleteNotificationByIdGQL, GetNotificationByUserIdGQL, InsertNotificationGQL, Notification_Insert_Input, Notification_Set_Input, UpdateNotificationByIdGQL } from "@hasura/generated";
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ToastService, ToastType } from "./toast.service";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  
  private readonly insertNotificationGQL = inject(InsertNotificationGQL);
  private readonly updateNotificationGQL = inject(UpdateNotificationByIdGQL);
  private readonly deleteNotificationByIdGQL = inject(DeleteNotificationByIdGQL);
  private readonly getNotificationByUserIdGQL = inject(GetNotificationByUserIdGQL);
  
  /**
   * Inserts notification and send email.
   * @param insertNotification 
   * @returns a bollean indicating whether the operation was successful.
   */
  public createNotification(insertNotification: Notification_Insert_Input, user: IUser): Observable<INotification | undefined> {
    return this.insertNotificationGQL.mutate({ variables: { object: insertNotification }}).pipe(
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
          mail: notification?.Mail ?? '',
          isDraft: notification?.IsDraft ?? false,
          isArchived: (notification as { IsArchieved?: boolean } | undefined)?.IsArchieved ?? false,
        }) satisfies INotification;
      }),
      catchError((error) => {
        console.error(`Error inserting notification: ${JSON.stringify(error)}`);
        this.toastService.showToast('Oh nein! Das hat leider nicht geklappt!', ToastType.Error);
        return of(undefined);
      })
    )
  }

  public updateNotification(updatedNotification: INotification): Observable<INotification | undefined> {
    const notification = {
      Subject: updatedNotification.subject,
      Content: updatedNotification.content,
      DueDate: updatedNotification.dueDate,
      IsDraft: updatedNotification.isDraft,
      IsArchived: updatedNotification.isArchived,
      Mail: updatedNotification.mail
    } satisfies Notification_Set_Input;

    return this.updateNotificationGQL.mutate({ variables: 
      { 
        id: updatedNotification.id, 
        object: notification 
      }}).pipe(
      takeUntilDestroyed(this.destroyRef),
      map((result) => {
        const notification = result.data?.update_Notification_by_pk;
        if (!notification) {
          this.toastService.showToast('Error updating notification. Please try again.', ToastType.Error);
          return undefined;
        }
        return ({
          id: notification?.Id ?? '',
          subject: notification?.Subject ?? '',
          content: notification?.Content ?? '',
          dueDate: notification?.DueDate ?? '',
          createdAt: notification?.CreatedAt ?? '',
          mail: notification?.Mail ?? '',
          isDraft: notification?.IsDraft ?? false,
          isArchived: notification.IsArchived ?? false,
        }) satisfies INotification;
      }),
      catchError((error) => {
        console.error(`Error updating notification: ${JSON.stringify(error)}`);
        this.toastService.showToast('Oh nein! Das hat leider nicht geklappt!', ToastType.Error);
        return of(undefined);
      })
    );
  }

  public loadNotifications(userId: string | undefined): Observable<INotification[]> {
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
        createdAt: n.CreatedAt,
        mail: n.Mail,
        isDraft: n.IsDraft ?? false,
        isArchived: n.IsArchived ?? false,
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
