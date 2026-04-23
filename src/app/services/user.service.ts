import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageService } from '@app/services/local-storage.service';
import { AuthService } from '@app/shared/authentication/auth.service';
import { GetUserByMailGQL } from '@hasura/generated';
import { IUser } from '@shared/models';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly getUserByMailGQL = inject(GetUserByMailGQL);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly currUser = signal<IUser | null>(null);
  public readonly freeNotificationsLimit = signal<number>(5);

  public readonly username = computed<string | null>(() => {
    this.localStorageService.storageChangeSignal();
    return this.localStorageService.getUserMail?.split('@')[0] ?? null;
  });

  public readonly createdNotesThisMonthCount = computed<number>(() => {
    this.localStorageService.storageChangeSignal();
    return this.localStorageService.getSendedNotificationCount(this.localStorageService.getUserMail ?? '');
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user?.email && this.authService.isAuthenticated()) {
        this.loadUser(user.email).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe();
      }
    })
  }

  private loadUser(mail: string): Observable<void> {
    return this.getUserByMailGQL.fetch({ variables: { mail } }).pipe(
      map(result => {
        const userData = result.data?.User[0];
        if (userData) {
          this.currUser.set({
            mail,
            name: userData.Name,
            userId: userData.Id
          } satisfies IUser);
        }
        else {
          console.error(`User with mail ${mail} not found.`);
          this.currUser.set(null);
        }
      })
    );
  }
}
