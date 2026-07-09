import { computed, inject, Injectable, signal } from '@angular/core';
import { InitialPreferences } from '@app/personal-space/data/preferences.model';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { GetUserByMailGQL, InsertUserGQL } from '@hasura/generated';
import { IUser } from '@shared/utils/models/user.model';
import { map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly getUserByMailGQL = inject(GetUserByMailGQL);
  private readonly insertUserGQL = inject(InsertUserGQL);

  public readonly currUser = signal<IUser | null>(null);
  public readonly freeNotificationsLimit = signal<number>(5);

  public readonly createdNotesThisMonthCount = computed<number>(() => {
    this.localStorageService.storageChangeSignal();
    return this.localStorageService.getSendedNotificationCount(this.localStorageService.getUserMail ?? '');
  });

  private normalizeMail(mail: string): string {
    return mail.trim().toLowerCase();
  }

  public getUserByMailOrCreateUserIfNotExists(mail: string): Observable<IUser> {
    const normalizedMail = this.normalizeMail(mail);
    const name = mail.split('@')[0]; // keep camelCase for username

    return this.insertUserGQL
      .mutate({ variables: { mail: normalizedMail, name, preferences: InitialPreferences } })
      .pipe(
        switchMap(res => {
          const inserted = res.data?.insert_User?.returning?.[0];

          if (inserted) {
            const user: IUser = {
              mail: normalizedMail,
              name: inserted.Name,
              userId: inserted.Id,
              newCreated: true,
            };
            return of(user);
          }

          // Conflict: User existiert bereits -> existierenden per Mail laden
          return this.loadUserFromDb(normalizedMail).pipe(
            switchMap(existing => {
              if (!existing) {
                return throwError(() => new Error(`User with mail ${normalizedMail} could not be resolved after upsert.`));
              }
              return of(existing);
            }),
          );
        }),
      );
  }

  private loadUserFromDb(mail: string): Observable<IUser | null> {
    const normalizedMail = this.normalizeMail(mail);
    return this.getUserByMailGQL.fetch({ variables: { mail: normalizedMail } }).pipe(
      map(result => {
        const userData = result.data?.User[0];
        if (userData) {
          return {
            mail: normalizedMail,
            name: userData.Name,
            userId: userData.Id,
            newCreated: false
          } satisfies IUser;
        }
        else {
          console.info(`User not found and will be created.`);
          return null;
        }
      })
    );
  }
}
