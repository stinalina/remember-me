import { inject, Injectable } from "@angular/core";
import { LOCAL_STORAGE } from "@shared/storage.token";

@Injectable ({ providedIn: 'root' })
export class LocalStorageService {
  private readonly stoarge = inject(LOCAL_STORAGE);

  private readonly USER_MAIL_TOKEN = 'user_mail';

  public getUserMail(): string | null {
    return this.stoarge.getItem(this.USER_MAIL_TOKEN);
  }

  public setUserMail(value: string): void {
    this.stoarge.setItem(this.USER_MAIL_TOKEN, value);
  }

  public getSendedNotificationCount(userMail: string): number {
    const value = this.stoarge.getItem(this.getSendedNotificationCountKey(userMail))?.split('_');
    if (value) {
      const month = new Date().getMonth();
      const lastMonth = Number(value[1]);
      if (month !== lastMonth) {
        this.setNotificationCount(0, userMail);
        return 0;
      }
      return Number(value[0]);
    }
    return 0
  }

  /**
   * Count will be reseted when new month starts
   * @param limit - default is 3; count won't increase when limit is reached
   */
  public increaseSendedNotificationCount(limit: number = 5): void {
    const user = this.getUserMail();
    if (!user) {
      console.error('User mail is not set in local storage. Cannot increase sended notification count.');
      return;
    }
    const value = this.stoarge.getItem(this.getSendedNotificationCountKey(user))?.split('_');
    let count = 1;
    const month = new Date().getMonth();
    if (value) {
      const lastMonth = Number(value[1]);
      count =  Number(value[0]);
      if (month === lastMonth && count < limit) {
        count++;
      }
    }
    this.setNotificationCount(count, user);
  }

  private setNotificationCount(count: number, userMail: string): void {
    const month = new Date().getMonth();
    this.stoarge.setItem(this.getSendedNotificationCountKey(userMail), `${count}_${month}`);
  }

  private getSendedNotificationCountKey(userMail: string): string {
    const normalizedMail = userMail.trim().toLowerCase();
    return `sended_notifications_count_${normalizedMail}`;
  }
}