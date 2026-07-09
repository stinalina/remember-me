import { computed, DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Member } from '@app/personal-space/data/member.model';
import { Preferences } from "@app/personal-space/data/preferences.model";
import { createEmptyYearStats, Stats } from "@app/personal-space/data/stats.model";
import { DeleteUserByIdGQL, GetMemberByIdGQL, UpdateNameGQL, UpdatePreferencesGQL, UpdateStatsGQL } from "@hasura/generated";
import { LocalStorageService } from "@root/src/app/shared/services/local-storage.service";
import { ToastService, ToastType } from '@services/toast.service';
import { catchError, EMPTY, map, Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' }) 
export class MemberService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly updatePreferencesGQL = inject(UpdatePreferencesGQL);
  private readonly updateStatsGQL = inject(UpdateStatsGQL);
  private readonly updateNameGQL = inject(UpdateNameGQL);
  private readonly deleteUserByIdGQL = inject(DeleteUserByIdGQL);

  private readonly getMemberByIdGQL = inject(GetMemberByIdGQL);

  public readonly member = signal<Member | null>(null);
  public readonly createdNotificationsThisMonthCount = computed<number>(() => {
    const member = this.member();
    if (!member) {
      return 0;
    }

    const currentYear = new Date().getFullYear().toString();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

    return member.stats[currentYear]?.[currentMonth] ?? 0;
  });

  public updateMail(userId: string, mail: string): Observable<void> {
    const updatedPreferences = { ...this.member()?.preferences, defaultMail: mail } as Preferences;
    return this.updatePreferences(userId, updatedPreferences);
  }

  public updatePreferences(userId: string, preferences: Preferences): Observable<void> {
    return this.updatePreferencesGQL.mutate({ variables: { id: userId, preferences } }).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Error updating user preferences:', error);
        this.toastService.showToast('Upss, das hat nicht geklappt. Das Backend ist momentan nicht erreichbar.', ToastType.Error);
        return EMPTY;
      }),
      tap(() => this.member.update(current => {
        if (current) {
          return { ...current, preferences: { ...current.preferences, ...preferences } };
        }
        return current;
      })),
      map(() => void(0))
   );
  }

  public increaseStatsCount(): Observable<void> {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const currentMember = this.member();
    if (!currentMember) {
      return EMPTY;
    }

    const yearStats = currentMember.stats[year]
      ? { ...currentMember.stats[year] }
      : createEmptyYearStats();

    const updatedStats = {
      ...currentMember.stats,
      [year]: yearStats,
    };

    updatedStats[year][month] = (updatedStats[year][month] || 0) + 1;
    this.localStorageService.increaseSendedNotificationCount();
    
    return this.updateStats(currentMember.id, updatedStats);
  }

  private updateStats(userId: string, stats: Stats): Observable<void> {
    return this.updateStatsGQL.mutate({ variables: { id: userId, stats } }).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Error updating user stats:', error);
        this.toastService.showToast('Upss, das hat nicht geklappt. Das Backend ist momentan nicht erreichbar.', ToastType.Error);
        return EMPTY;
      }),
      tap(() => this.member.update(current => {
        if (current) {
          return { ...current, stats: { ...stats } };
        }
        return current;
      })),
      map(() => void(0))
   );
  }

  public loadMember(id: string): Observable<void> {
    return this.getMemberByIdGQL.fetch({ variables: { id } }).pipe(
      map(result => {
        const data = result.data?.User[0];
        if (data) {
          this.member.set({
            id,
            name: data.Name,
            preferences: data.Preferences,
            stats: data.Stats,
            mail: data.Mail
          } satisfies Member);
        }
        else {
          console.error(`User with id ${id} not found.`);
          this.member.set(null);
          throw new Error(`Hasura query did not return user data for id: ${id}`);
        }
      })
    );
  }

  public updateName(userId: string, name: string): Observable<void> {
    return this.updateNameGQL.mutate({ variables: { id: userId, name } }).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Error updating user name:', error);
        this.toastService.showToast('Upss, das hat nicht geklappt. Das Backend ist momentan nicht erreichbar.', ToastType.Error);
        return EMPTY;
      }),
      tap(() => this.member.update(current => {
        if (current) {
          return { ...current, name };
        }
        return current;
      })),
      map(() => void(0))
    );
  }

  public deleteMember(userId: string): Observable<void> {
    return this.deleteUserByIdGQL.mutate({ variables: { id: userId } }).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Error deleting user:', error);
        this.toastService.showToast('Upss, das hat nicht geklappt. Das Backend ist momentan nicht erreichbar.', ToastType.Error);
        return EMPTY;
      }),
      map(() => void(0))
    );
  }
}
