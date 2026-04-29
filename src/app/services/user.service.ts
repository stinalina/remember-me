import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InitialPreferences } from '@app/personal-space/data/preferences.model';
import { LocalStorageService } from '@app/services/local-storage.service';
import { AuthService } from '@app/shared/authentication/auth.service';
import { GetUserByMailGQL, InsertUserGQL } from '@hasura/generated';
import { IUser } from '@shared/models';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly getUserByMailGQL = inject(GetUserByMailGQL);
  private readonly insertUserGQL = inject(InsertUserGQL);
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
        this.getUserByMailOrCreateUserIfNotExists(user.email).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe();
      }
    })
  }

  public addUserToDb(mail: string): Observable<IUser> {
    const name = mail.split('@')[0];
    return this.insertUserGQL.mutate({ variables: { mail, name, preferences: InitialPreferences } }).pipe(
      map(res => ({
        mail,
        name: res.data?.insert_User?.returning[0].Name ?? '',
        userId: res.data?.insert_User?.returning[0].Id,
        newCreated: true
      } satisfies IUser)
    ));
  }

  public getUserByMailOrCreateUserIfNotExists(mail: string): Observable<IUser> {
    return this.loadUserFromDb(mail).pipe(
      switchMap(user => {
        if (user) {
          return of(user);
        } else {
          return this.addUserToDb(mail);
        }
      })
    );
  }

  private loadUserFromDb(mail: string): Observable<IUser | null> {
    return this.getUserByMailGQL.fetch({ variables: { mail } }).pipe(
      map(result => {
        const userData = result.data?.User[0];
        if (userData) {
          this.currUser.set({
            mail,
            name: userData.Name,
            userId: userData.Id,
            newCreated: false
          } satisfies IUser);
        }
        else {
          console.error(`User with mail ${mail} not found.`);
          this.currUser.set(null);
        }
        return this.currUser();
      })
    );
  }
}
