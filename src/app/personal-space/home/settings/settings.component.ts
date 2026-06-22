import { ChangeDetectionStrategy, Component, DestroyRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { ConfirmDialog } from '@app/personal-space/ui/confirmation-dialog/confirmation.dialog';
import { MemberService } from '@app/personal-space/utils/member.service';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';
import { NotificationService } from '@root/src/app/shared/services/notification.service';
import { ToastService, ToastType } from '@services/toast.service';
import { AuthService } from '@shared/utils/authentication/auth.service';
import { finalize, switchMap } from 'rxjs';

@Component({
  selector: 'reme-personal-settings',
  templateUrl: './settings.component.html',
  imports: [
    ContentFrameComponent,
    ConfirmDialog,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly memberService = inject(MemberService);
  private readonly notificationService = inject(NotificationService);

  protected readonly editingUsername = signal(false);
  protected readonly editingDefaultMail = signal(false);
  protected readonly editingPassword = signal(false);
  protected readonly isSaving = signal(false);

  protected readonly member = this.memberService.member;
  protected readonly passwordConfirmDialog = viewChild.required<ConfirmDialog>('passwordConfirmDialog');
  protected readonly deleteConfirmDialog = viewChild.required<ConfirmDialog>('deleteConfirmDialog');
  protected readonly defaultMailValue = linkedSignal(() => this.member()?.preferences?.defaultMail ?? this.member()?.mail);
  protected readonly usernameValue = linkedSignal(() => this.member()?.name ?? 'Unbekannt'); //Bei Usern, die nach v1.0.0 eingeführt wurden, ist der Name immer gesetzt. 
  protected readonly passwordValue = signal('');
  protected readonly currentPasswordValue = signal('');
  protected readonly deleteAccountPasswordValue = signal('');

  protected startEditing(field: 'username' | 'defaultMail' | 'password'): void {
    if (field === 'username') {
      this.editingUsername.set(true);
    }
    if (field === 'defaultMail') {
      this.editingDefaultMail.set(true);
    }
    if (field === 'password') {
      this.passwordValue.set('');
      this.currentPasswordValue.set('');
      this.editingPassword.set(true);
    }
  }

  protected cancelEditing(field: 'username' | 'defaultMail' | 'password'): void {
    if (field === 'username') {
      this.editingUsername.set(false);
      this.usernameValue.set(this.member()?.name ?? 'Unbekannt');
    }
    if (field === 'defaultMail') {
      this.editingDefaultMail.set(false);
      this.defaultMailValue.set(this.member()?.preferences?.defaultMail ?? this.member()?.mail);
    }
    if (field === 'password') {
      this.passwordValue.set('');
      this.currentPasswordValue.set('');
      this.editingPassword.set(false);
    }
  }

  protected saveUsername(): void {
    const member = this.member();
    if (!member) {
      return;
    };
    this.isSaving.set(true);
    this.memberService.updateName(member.id, this.usernameValue()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isSaving.set(false))
    ).subscribe(() => {
        this.toastService.showToast('Benutzername erfolgreich gespeichert.', ToastType.Success);
        this.editingUsername.set(false);
      });
  }

  protected saveDefaultMail(): void {
    const member = this.member();
    if (!member) {
      return;
    };
    this.isSaving.set(true);
    this.memberService.updateMail(member.id, this.defaultMailValue()!).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isSaving.set(false))
    ).subscribe(() => {
        this.toastService.showToast('Standard-E-Mail erfolgreich gespeichert.', ToastType.Success);
        this.editingDefaultMail.set(false);
    });
  }

  protected savePassword(): void {
    const newPassword = this.passwordValue();
    if (newPassword.length < 6) {
      return;
    };

    this.currentPasswordValue.set('');
    this.passwordConfirmDialog().show();
  }

  protected confirmSavePassword(): void {
    const newPassword = this.passwordValue();
    const currentPassword = this.currentPasswordValue().trim();
    if (newPassword.length < 6 || currentPassword.length === 0) {
      return;
    }

    this.isSaving.set(true);
    this.authService.updatePassword(newPassword, currentPassword).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.toastService.showToast('Passwort erfolgreich geändert.', ToastType.Success);
        this.passwordValue.set('');
        this.currentPasswordValue.set('');
        this.editingPassword.set(false);
      },
    });
  }

  protected deleteAccount(): void {
    const member = this.memberService.member();
    const currentPassword = this.deleteAccountPasswordValue().trim();
    if (!member) {
      return;
    }
    if (currentPassword.length === 0) {
      return;
    }

    this.isSaving.set(true);
    this.notificationService.deleteAllNotificationsByUserId(member.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.memberService.deleteMember(member.id)),
      switchMap(() => this.authService.deleteAccount(currentPassword)),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.toastService.showToast('Dein Profil wurde erfolgreich gelöscht.', ToastType.Success);
        this.router.navigate([ROUTER_TOKENS.LOGIN]);
      },
    });
  }

  protected openDeleteAccountDialog(): void {
    this.deleteAccountPasswordValue.set('');
    this.deleteConfirmDialog().show();
  }
}
