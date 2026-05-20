import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Member } from '@app/personal-space/data/member.model';
import { Preferences } from "@app/personal-space/data/preferences.model";
import { ToastService, ToastType } from '@app/services/toast.service';
import { GetMemberByIdGQL, UpdatePreferencesGQL } from "@hasura/generated";
import { catchError, EMPTY, map, Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' }) 
export class MemberService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly updatePreferencesGQL = inject(UpdatePreferencesGQL);

  private readonly getMemberByIdGQL = inject(GetMemberByIdGQL);

  public readonly member = signal<Member | null>(null);

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

  public loadMember(id: string): Observable<void> {
    return this.getMemberByIdGQL.fetch({ variables: { id } }).pipe(
      map(result => {
        const data = result.data?.User[0];
        if (data) {
          this.member.set({
            id,
            name: data.Name,
            preferences: data.Preferences,
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
}
