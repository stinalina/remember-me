import { environment } from './../../../../environment';
import { inject, Inject, Injectable } from "@angular/core";
import { GetUserByMailGQL, InsertNotificationGQL, InsertNotificationMutationVariables, InsertUserGQL } from "../../../graphql/generated";
import { INotification, IUser } from "../models";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, pipe, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private readonly httpClient = inject(HttpClient);

  private readonly insertUser = inject(InsertUserGQL);
  private readonly getUserByMail = inject(GetUserByMailGQL);
  private readonly insertNotification = inject(InsertNotificationGQL);

  public getUserByMailOrCreateUserIfNotExists(mail: string): Observable<string> {
    return this.getUserByMail.fetch({ variables: { mail } }).pipe(
      switchMap((result) => {
        const userExists = result.data?.dev_User.length !== 0 && result.data?.dev_User[0].Id != null;
        if (userExists) {
          return of(result.data?.dev_User[0].Id);
        } else {
          return this.insertUser.mutate({ variables: { mail, name: 'Unknown' } }).pipe(
            tap((res) => console.log(`Created new user with id: ${res.data?.insert_dev_User?.returning[0].Id}`)),
            map((res) => res.data?.insert_dev_User?.returning[0].Id!)
          );
        }
      })
    );
  }

  /**
   * subscribes to a post which sends a welcome mail. catchs the error and logs it.
   * @param mail 
   */
  public sendWelcomeMail(mail: string): void {
    try {
      this.httpClient.post(`${environment.SEND_WELCOME_MAIL_URL}?email=${mail}`, {}).subscribe();
    } catch (error) {
      console.error(`Error sending welcome email: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Inserts notification and send email.
   * @param notification 
   * @returns a bollean indicating whether the operation was successful.
   */
  public createNotification(notification: INotification, userId: string): Observable<boolean> {
    const variables: InsertNotificationMutationVariables = {
      objects: [
        {
          Content: notification.content,
          DueDate: notification.dueDate,
          UserId: userId, //'c27b71b1-d3a1-4253-8079-712cc346a9a6',
          Subject: notification.subject
        }
      ]
    };
    return this.insertNotification.mutate({variables}).pipe(
      catchError((error) => {
        console.error(`Error inserting notification: ${JSON.stringify(error)}`);
        return of(false);
      }),
      tap((result) => console.log(`Inserted notification: ${JSON.stringify(result)}`)),
      map(() => {
        this.sendWelcomeMail(notification.mail);
        return true;
      })
    )
  }
}
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //   try {
    //     toast.success('Congratulations!\nErinnerung erfolgreich erstellt!', {
    //       position: 'top-right',
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //     });
    //     resolve();
    //   } catch (err: unknown) {
    //     toast.error(`Holy smokes!\n${(err as Error).message}`, {
    //       position: 'top-right',
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //     });
    //   } catch (err: unknown) {
    //     toast.error(`Holy smokes!\n${(err as Error).message}`, {
    //       position: 'top-right',