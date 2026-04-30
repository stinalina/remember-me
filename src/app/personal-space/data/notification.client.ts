import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { INotification } from "@app/personal-space/data/notification.model";
import { UserService } from "@app/services/user.service";
import { DeleteNotificationByIdGQL, GetNotificationByUserIdGQL } from "@hasura/generated";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' }) //TODO just in home
export class NotificationClient {
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);

  private readonly deleteNotificationByIdGQL = inject(DeleteNotificationByIdGQL);
  private readonly getNotificationByUserIdGQL = inject(GetNotificationByUserIdGQL);

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
      map(() => true),
      catchError(error => {
        console.error('Error deleting notification:', error);
        return of(false);
      })
    );
  }
}