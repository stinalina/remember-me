import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { GetUserByMailGQL, InsertNotificationGQL, InsertNotificationMutationVariables, InsertUserGQL } from "@hasura/generated";
import { INotification, IUser } from "@shared/models";
import { ToastService, ToastType } from "./toast.service";
import { environment } from "@environments/environment";

type UserRegistrationResponse = {
  success: boolean;
  callCount: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  
  private readonly insertUser_Dev = inject(InsertUserGQL);
  private readonly getUserByMail_Dev = inject(GetUserByMailGQL);
  private readonly insertNotification_Dev = inject(InsertNotificationGQL);

  private readonly unkownUserName = 'Unknown';
  
  public getUserByMailOrCreateUserIfNotExists(mail: string): Observable<IUser> {
    return this.getUserByMail_Dev.fetch({ variables: { mail } }).pipe(
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
          return this.insertUser_Dev.mutate({ variables: { mail, name: this.unkownUserName } }).pipe(
            tap((res) => console.log(`Created new user with id: ${res.data?.insert_User?.returning[0].Id}`)),
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
    return this.insertNotification_Dev.mutate({variables}).pipe(
      tap((result) => console.log(`Inserted notification: ${JSON.stringify(result)}`)),
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

  public storeUserAsInterestedParty(mail: string): Observable<number> {
    const payload = {
      Mail: mail,
      Name: this.unkownUserName
    };

    const url = `${environment.BACKEND_URL}${environment.SEND_REGISTER_INTERESTED_PARTY_MAIL_URL}`;
    return this.httpClient.post<UserRegistrationResponse>(url, payload).pipe(
      tap({
        next: (response) => console.log('Register interested party email sent successfully!', response),
        error: (error) => console.error(`Error sending register interested party email: ${JSON.stringify(error)}`)
      }),
      map((response: UserRegistrationResponse) => response.callCount));
  }

  /**
   * subscribes to a post which sends a welcome mail. catchs the error and logs it.
   * @param user 
   */
  private sendWelcomeMail(user: IUser): void {
    const payload = {
      Mail: user.mail,
      Name: user.name === this.unkownUserName ? '' : user.name
    };

    const url = environment.BACKEND_URL + environment.SEND_WELCOME_MAIL_URL;
    this.httpClient.post(url, payload)
    .subscribe({
      next: (response) => console.log('Welcome email sent successfully!', response),
      error: (error) => console.error(`Error sending welcome email: ${JSON.stringify(error)}`)
    });
  }
}
