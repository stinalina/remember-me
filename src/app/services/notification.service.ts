import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environment';
import { GetUserByMail_DevGQL, GetUserByMail_ProdGQL, InsertNotification_DevGQL, InsertNotification_DevMutationVariables, InsertNotification_ProdGQL, InsertNotification_ProdMutationVariables, InsertUser_DevGQL, InsertUser_ProdGQL } from "../../graphql/generated";
import { INotification, IUser } from "../shared/models";
import { ToastService, ToastType } from "./toast.service";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  
  private readonly insertUser_Dev = inject(InsertUser_DevGQL);
  private readonly getUserByMail_Dev = inject(GetUserByMail_DevGQL);
  private readonly insertNotification_Dev = inject(InsertNotification_DevGQL);

  private readonly insertUser_Prod = inject(InsertUser_ProdGQL);
  private readonly getUserByMail_Prod = inject(GetUserByMail_ProdGQL);
  private readonly insertNotification_Prod = inject(InsertNotification_ProdGQL);

  private readonly unkownUserName = 'Unknown';
  
  public getUserByMailOrCreateUserIfNotExists(mail: string): Observable<IUser> {
    return environment.production
      ? this.getUserByMailOrCreateUserIfNotExists_Prod(mail)
      : this.getUserByMailOrCreateUserIfNotExists_Dev(mail);
  }

  /**
   * Inserts notification and send email.
   * @param notification 
   * @returns a bollean indicating whether the operation was successful.
   */
  public createNotification(notification: INotification, user: IUser): Observable<boolean> {
    return environment.production
      ? this.createNotification_Prod(notification, user)
      : this.createNotification_Dev(notification, user);
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

    this.httpClient.post(`${environment.SEND_WELCOME_MAIL_URL}`, payload)
    .subscribe({
      next: (response) => console.log('Welcome email sent successfully!', response),
      error: (error) => console.error(`Error sending welcome email: ${JSON.stringify(error)}`)
    });
  }

  private getUserByMailOrCreateUserIfNotExists_Dev(mail: string): Observable<IUser> {
    return this.getUserByMail_Dev.fetch({ variables: { mail } }).pipe(
      switchMap((result) => {
        const userExists = result.data?.dev_User.length !== 0;
        if (userExists) {
          return of({
            mail,
            name: result.data?.dev_User[0].Name ?? '',
            userId: result.data?.dev_User[0].Id,
            newCreated: false
          } satisfies IUser);
        } else {
          return this.insertUser_Dev.mutate({ variables: { mail, name: this.unkownUserName } }).pipe(
            tap((res) => console.log(`Created new user with id: ${res.data?.insert_dev_User?.returning[0].Id}`)),
            map((res) => ({
              mail,
              name: res.data?.insert_dev_User?.returning[0].Name ?? '',
              userId: res.data?.insert_dev_User?.returning[0].Id,
              newCreated: true
            } satisfies IUser)
          ));
        }
      })
    );
  }

  private getUserByMailOrCreateUserIfNotExists_Prod(mail: string): Observable<IUser> {
    return this.getUserByMail_Prod.fetch({ variables: { mail } }).pipe(
      switchMap((result) => {
        const userExists = result.data?.prod_User.length !== 0;
        if (userExists) {
          return of({
            mail,
            name: result.data?.prod_User[0].Name ?? '',
            userId: result.data?.prod_User[0].Id,
            newCreated: false
          } satisfies IUser);
        } else {
          return this.insertUser_Prod.mutate({ variables: { mail, name: this.unkownUserName } }).pipe(
            tap((res) => console.log(`Created new user with id: ${res.data?.insert_prod_User?.returning[0].Id}`)),
            map((res) => ({
              mail,
              name: res.data?.insert_prod_User?.returning[0].Name ?? '',
              userId: res.data?.insert_prod_User?.returning[0].Id,
              newCreated: true
            } satisfies IUser)
          ));
        }
      })
    );
  }

  private createNotification_Dev(notification: INotification, user: IUser): Observable<boolean> {
      const variables: InsertNotification_DevMutationVariables = {
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

  private createNotification_Prod(notification: INotification, user: IUser): Observable<boolean> {
    const variables: InsertNotification_ProdMutationVariables = {
      objects: [
        {
          Content: notification.content,
          DueDate: notification.dueDate,
          UserId: user.userId,
          Subject: notification.subject
        }
      ]
    };

    return this.insertNotification_Prod.mutate({variables}).pipe(
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
}
