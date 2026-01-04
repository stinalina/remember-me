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

  private readonly unkownUserName = 'Unknown';

  public getUserByMailOrCreateUserIfNotExists(mail: string): Observable<IUser> {
    return this.getUserByMail.fetch({ variables: { mail } }).pipe(
      switchMap((result) => {
        const userExists = result.data?.dev_User.length !== 0;
        if (userExists) {
          return of({
            mail,
            name: result.data?.dev_User[0].Name ?? '',
            userId: result.data?.dev_User[0].Id
          } satisfies IUser);
        } else {
          return this.insertUser.mutate({ variables: { mail, name: this.unkownUserName } }).pipe(
            tap((res) => console.log(`Created new user with id: ${res.data?.insert_dev_User?.returning[0].Id}`)),
            map((res) => res.data?.insert_dev_User?.returning[0].Id!)
          );
        }
      })
    );
  }

  /**
   * subscribes to a post which sends a welcome mail. catchs the error and logs it.
   * @param user 
   */
  public sendWelcomeMail(user: IUser): void {
      const payload = {
        Mail: user.mail,
        Name: user.name === this.unkownUserName ? '' : user.name
      };

     this.httpClient.post(`${environment.SEND_WELCOME_MAIL_URL}`, payload)
      .subscribe({
        next: (response) => console.log('Welcome email sent successfully!', response),
        error: (error) => console.error(`Error sending welcome email: ${JSON.stringify(error)}`)
      });
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
    return this.insertNotification.mutate({variables}).pipe(
      catchError((error) => {
        console.error(`Error inserting notification: ${JSON.stringify(error)}`);
        return of(false);
      }),
      tap((result) => console.log(`Inserted notification: ${JSON.stringify(result)}`)),
      map(() => {
        this.sendWelcomeMail(user);
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