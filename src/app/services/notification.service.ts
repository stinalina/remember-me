import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { GetUserByMailGQL, InsertNotificationGQL, InsertNotificationMutationVariables, InsertUserGQL } from "@hasura/generated";
import { INotification, IUser } from "@shared/models";
import { ToastService, ToastType } from "./toast.service";
import { environment } from "@environments/environment";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  
  private readonly insertUserGQL = inject(InsertUserGQL);
  private readonly getUserByMailGQL = inject(GetUserByMailGQL);
  private readonly insertNotificationGQL = inject(InsertNotificationGQL);

  private readonly unkownUserName = 'Unknown';
  
  public getUserByMailOrCreateUserIfNotExists(mail: string): Observable<IUser> {
    return this.getUserByMailGQL.fetch({ variables: { mail } }).pipe(
      switchMap((result) => {
        const userExists = result.data?.User.length !== 0;
        if (userExists) {
          return of({
            mail,
            name: result.data?.User[0].Name ?? '',
            userId: result.data?.User[0].Id,
            newCreated: false
          } satisfies IUser);
        } else {
          return this.insertUserGQL.mutate({ variables: { mail, name: this.unkownUserName } }).pipe(
            map((res) => ({
              mail,
              name: res.data?.insert_User?.returning[0].Name ?? '',
              userId: res.data?.insert_User?.returning[0].Id,
              newCreated: true
            } satisfies IUser)
          ));
        }
      })
    );
  }

  /**
   * Inserts notification and send email.
   * @param notification 
   * @returns a bollean indicating whether the operation was successful.
   */
  public createNotification(notification: INotification, user: IUser): Observable<boolean> {
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
    this.httpClient.post(url, payload)
    .subscribe({
      error: (error) => console.error(`Error sending welcome email: ${JSON.stringify(error)}`)
    });
  }
}
