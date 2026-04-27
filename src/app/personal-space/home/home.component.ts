import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { AvatarDialog } from '@app/personal-space/components/avatar-dialog/avatar.dialog';
import { InitialPreferences, Preferences } from '@app/personal-space/data/preferences.model';
import { NotesComponent } from '@app/personal-space/home/notes/notes.component';
import { SettingsComponent } from '@app/personal-space/home/settings/settings.component';
import { MemberService } from '@app/personal-space/utils/member.service';
import { UserService } from '@app/services/user.service';
import { AuthService } from '@app/shared/authentication/auth.service';
import { OutletContainer, SelectedTabComponentEnum } from '@app/shared/outlet-container';
import { RangePipe } from '@app/shared/pipe/range.pipe';
import { finalize } from 'rxjs';
import { StatsComponent } from "./stats/stats.component";
import { AvatarImagePipe } from '@app/personal-space/utils/avatar-image.pipe';

@Component({
  selector: 'reme-personal-home',
  templateUrl: './home.component.html',
  imports: [
    AvatarDialog,
    AvatarImagePipe,
    SettingsComponent,
    NgTemplateOutlet,
    NotesComponent,
    RangePipe,
    StatsComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends OutletContainer {
  protected readonly outletContainerRef = viewChild.required<ElementRef>('outletContainer');

  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly memberService = inject(MemberService);
  protected readonly authenticationService = inject(AuthService);

  protected readonly SelectedTab = SelectedTabComponentEnum;
  protected readonly selectedTabComponent = signal<SelectedTabComponentEnum>(SelectedTabComponentEnum.Notes);

  protected readonly username = computed<string>(() => this.userService.username() ?? 'Nutzer');
  protected readonly freeNotificationsLimit = computed<number>(() => this.userService.freeNotificationsLimit());
  protected readonly notificationsCount = computed<number>(() => this.userService.createdNotesThisMonthCount());
  protected readonly usedNotesTooltip = computed<string>(() => `${this.notificationsCount()} von ${this.freeNotificationsLimit()} Erinnerungen erstellt diesen Monat.`);

  protected readonly member = this.memberService.member;
  protected readonly preferences = computed<Preferences>(() => this.member()?.preferences ?? InitialPreferences);

  protected readonly avatarName = computed<string>(() => {
    const avatarName = this.preferences().avatarName;
    if (!avatarName) {
      return InitialPreferences.avatarName;
    }
    return avatarName;
  });

  protected override selectTab(tab: SelectedTabComponentEnum): void {
    this.selectedTabComponent.set(tab);
    this.scrollToOutlet(this.outletContainerRef());
  }

  protected logout(): void {
    this.authenticationService.signOut().pipe(
      finalize(() => {
        this.router.navigate([ROUTER_TOKENS.LOGIN]); //ignore logout failure and navigate to login page anyway
      })
    ).subscribe();
  }

  protected changeAvatar(value: string): void {
    this.memberService.updatePreferences(this.userService.currUser()!.userId, { avatarName: value })
      .subscribe();
  }
}
