import { inject, Injectable } from "@angular/core";
import { LOCAL_STORAGE } from "../shared/storage.token";
import { DatePipe } from "@angular/common";

@Injectable ({ providedIn: 'root' })
export class LocalStorageService {
  private readonly stoarge = inject(LOCAL_STORAGE);

  private readonly USER_MAIL_TOKEN = 'user_mail';
  private readonly SENDED_NOTIFICATIONS_COUNT_TOKEN = 'sended_notifications_count';

  public getUserMail(): string | null {
    return this.stoarge.getItem(this.USER_MAIL_TOKEN);
  }

  public setUserMail(value: string): void {
    this.stoarge.setItem(this.USER_MAIL_TOKEN, value);
  }

  public getSendedNotificationCount(): number {
    const value = this.stoarge.getItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN);
    if (value) {
      return Number(value?.split('_')[0]);
    }
    return 0;
  }

  /**
   * Count will be reseted when new month starts
   * @param limit - max count; count won't increase when limit is reached
   */
  public increaseSendedNotificationCount(limit: number = 3): void {
    const value = this.stoarge.getItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN);
    let count = 0;
    let month = new Date().getMonth();
    if (value) {
      const lastMonth = Number(value?.split('_')[1]);
      count =  Number(value?.split('_')[0]);
      if (month === lastMonth && count < limit) {
        count++;
      }
    }
    
    const newValue = `${count}_${month}`;
    this.stoarge.setItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN, newValue);
  }
}