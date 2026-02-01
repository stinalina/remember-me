import { inject, Injectable } from "@angular/core";
import { LOCAL_STORAGE } from "../shared/storage.token";

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
    const count = this.stoarge.getItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN);
    return count ? Number(count) : 0;
  }

  public increaseSendedNotificationCount(): void {
    let count = this.getSendedNotificationCount();
    this.stoarge.setItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN, (count+1).toString());
  }
}