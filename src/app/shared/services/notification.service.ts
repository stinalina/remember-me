import { environment } from './../../../../environment';
import { inject, Inject, Injectable } from "@angular/core";
import { InsertNotificationGQL, InsertNotificationMutationVariables, InsertUserGQL } from "../../../graphql/generated";
import { INotification, IUser } from "../models";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private insertUser = inject(InsertUserGQL);
  private insertNotification = inject(InsertNotificationGQL);
  private httpClient = inject(HttpClient);

  public sendNotification(notification: INotification): Promise<void> {
    const variables: InsertNotificationMutationVariables = {
      objects: [
        {
          Content: notification.content,
          DueDate: notification.dueDate,
          UserId: 'c27b71b1-d3a1-4253-8079-712cc346a9a6',
          Subject: notification.subject
        }
      ]
    };
    return new Promise((resolve) => setTimeout(async () => {
      //await this.createUserIfNotExists();
      this.insertNotification.mutate({variables}).subscribe({
      next: (result) => {
        console.log('Inserted notification:', result.data?.insert_dev_Notification?.returning);
        this.httpClient.post(`${environment.SEND_WELCOME_MAIL_URL}/${notification.mail}`, {}).subscribe(
          { 
            next: () => console.log('Welcome email sent successfully.'), 
            error: (err) => console.error('Error sending welcome email:', err) 
          }
        )
      },
      error: (error) => {
        console.error('Error inserting notification:', error);
      }
    });
      resolve(); //without this the promise never terminates aka resolves
    } , 1000));
  }

  // private createUserIfNotExists(user: IUser): Promise<void> {
  //   return this.insertUser.mutate({ mail, name }).toPromise().then(() => {
  //     console.log(`User with mail ${mail} created/exists.`);
  //   });
  // }
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