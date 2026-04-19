import { computed, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@app/services/local-storage.service';
import { IUser } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly localStorageService = inject(LocalStorageService);

  public readonly currUser = signal<IUser | null>(null);
  public readonly freeNotificationsLimit = signal<number>(5);

  public readonly username = computed<string | null>(() => {
    this.localStorageService.storageVersion();
    return this.localStorageService.getUserMail?.split('@')[0] ?? null;
  });
  public readonly createdNotesThisMonthCount = computed<number>(() => {
    this.localStorageService.storageVersion();
    return this.localStorageService.getSendedNotificationCount(this.localStorageService.getUserMail ?? '');
  });
}
