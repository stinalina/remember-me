import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, linkedSignal, OnDestroy, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormsModule } from '@angular/forms';
import { email, form, FormField, maxLength, required, validate } from '@angular/forms/signals';
import { INotification } from '@app/shared/utils/models/notification.model';
import { TypewriterActionType, TypewriterEffectService } from '@app/shared/services/typewriter-effect.service';
import { Notification_Insert_Input, Notification_Set_Input } from '@hasura/generated';
import { LocalStorageService } from '@services/local-storage.service';
import { NotificationService } from '@services/notification.service';
import { ToastService, ToastType } from '@services/toast.service';
import { EDITOR_TOOLBAR_MIN_CONFIG_TOKEN } from '@app/shared/utils/token/editor-config.token';
import { SESSION_STORAGE } from '@app/shared/utils/token/storage.token';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { catchError, delay, EMPTY, finalize, switchMap } from 'rxjs';
import { htmlContentValidator } from '@app/shared/utils/validators/html-content.validator';
import { IUser } from '@app/shared/utils/models/user.model';
import { UserService } from '@app/shared/services/user.service';
import { CheckboxComponent } from '@app/shared/utils/checkbox/checkbox.component';
import { AuthService } from '@root/src/app/shared/utils/authentication/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-notification-editor',
  templateUrl: 'notification-editor.component.html',
  styleUrl: 'notification-editor.component.scss',
  imports: [
    CheckboxComponent,
    NgxEditorModule,
    NgTemplateOutlet,
    FormField,
    FormsModule
  ] 
})
export class NotificationEditorComponent implements OnInit, OnDestroy {
  public readonly editorMode = input<'create' | 'edit'>('create');
  public readonly notification = input<INotification | undefined>(undefined);
  public readonly notificationChanged = output<INotification | undefined>();

  private readonly notificationService = inject(NotificationService);
  private readonly authenticationService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionStorage = inject(SESSION_STORAGE);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly toastService = inject(ToastService);
  private readonly typewriterEffectService = inject(TypewriterEffectService);
  
  protected readonly isLoggedIn = this.authenticationService.isAuthenticated.asReadonly();
  private readonly freeNotificationsLimit = this.userService.freeNotificationsLimit;
  private readonly limitReached = signal<boolean>(false);

  public readonly editor: Editor = new Editor();
  public readonly toolbar: Toolbar = inject(EDITOR_TOOLBAR_MIN_CONFIG_TOKEN);

  private readonly notificationModel = signal({
    subject: '',
    additionalInfo: '',
    content: '',
    mail: this.localStorageService.getUserMail ?? '',
    dateTime: this.tomorrow,
    isDraft: false,
  });
  
  protected readonly notificationForm = form(this.notificationModel, (path) => {
    maxLength(path.subject, 100);
    required(path.content);
    validate(path.content, ({ value }) => {
      const errors = htmlContentValidator()({ value: value() } as AbstractControl);
      if (errors?.['required']) {
        return {
          kind: 'required',
          message: 'Inhalt darf nicht leer sein',
        };
      }

      if (errors?.['minlength']) {
        return {
          kind: 'minlength',
          message: 'Inhalt ist zu kurz',
        };
      }

      return null;
    });

    required(path.mail);
    email(path.mail);
    validate(path.mail, ({ value }) => {
      if (this.editorMode() !== 'create') {
        return null;
      }

      const limitReached = this.localStorageService.getSendedNotificationCount(value()) >= this.freeNotificationsLimit();
      if (limitReached) {
        return {
          kind: 'freeLimitReached',
          message: 'Limit für Benachrichtigungen diesen Monat erreicht',
        };
      }

      return null;
    });

    required(path.dateTime);
    validate(path.dateTime, ({ value }) => {
      if (value() < this.tomorrow) {
        return {
          kind: 'minDate',
          message: 'Datum muss in der Zukunft liegen',
        };
      }

      return null;
    });
  });

  protected readonly retry = signal<boolean>(false);
  protected readonly sendingNotification = signal<boolean>(false);
  protected readonly placeholderSubject = 'Grüße von Notify!';

  public readonly typedPlaceholder = signal('');
  public readonly showPlaceholderAnimation = linkedSignal(() => this.editorMode() === 'create');

  private get tomorrow(): string {
    const date = new Date();
    const dateTime = new Date(date.getTime() + 24 * 60 * 60 * 1000); // add one day
    return new DatePipe('en-US').transform(dateTime, 'yyyy-MM-dd')!;
  }

  constructor() {
    effect(() => {
      const notification = this.notification();
      if (!notification) {
        return;
      }
      let dueDate = notification.dueDate;
      if (dueDate) {
        dueDate = new DatePipe('en-US').transform(dueDate, 'yyyy-MM-dd')!;
      }

      this.notificationModel.set({
        subject: notification.subject ?? '',
        additionalInfo: '',
        content: notification.content ?? '',
        mail: notification.mail ?? '',
        dateTime: dueDate ?? this.tomorrow,
        isDraft: notification.isDraft ?? false,
      });
    });

    effect(() => {
      if (this.limitReached() && this.editorMode() === 'create') {
        this.resetForm();
        this.typewriterEffectService.setActions([
          { type: TypewriterActionType.PAUSE, duration: 1000 },
          { type: TypewriterActionType.TYPE, text: 'Maximum of free notifications reached for this month.' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.PAUSE, duration: 2000 },
          { type: TypewriterActionType.TYPE, text: ' Do you want to create more notifications?' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.TYPE, text: ' Just hold on!' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.TYPE, text: ' *Reason: This is still in development mode and every request to the database costs money.' },
        ]);
        this.showPlaceholderAnimation.set(true);
        this.typewriterEffectService.animatePlaceholder(this.updatePlaceholder.bind(this));
      }
    });
  }

  public ngOnInit(): void {
    if (!this.checkIfMaxSendedNotificationCountIsReached()) {
      this.restoreDraftIfExists();
    
      if (this.showPlaceholderAnimation()) {
        this.typewriterEffectService.setActions([
          { type: TypewriterActionType.PAUSE, duration: 1000 },
          { type: TypewriterActionType.TYPE, text: 'Im März diesmal wirklich dran denken Tickets für das Sommerfes' },
          { type: TypewriterActionType.PAUSE, duration: 3000 },
          { type: TypewriterActionType.DELETE, count: 13 },
          { type: TypewriterActionType.TYPE, text: 'Rock am Ring zu kaufen.' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.PAUSE, duration: 500 },
          { type: TypewriterActionType.TYPE, text: ' Manu auc' },
          { type: TypewriterActionType.DELETE, count: 3 },
          { type: TypewriterActionType.TYPE, text: 'und <u>Felix</u> auch einladen.' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.PAUSE, duration: 2000 },
          { type: TypewriterActionType.TYPE, text: ' Für Lisa die <strong>Mütze</strong> mitbringen, die sie beim Weihnachtsmarktbesuch vergessen hat.' },
          { type: TypewriterActionType.PAUSE, duration: 3000 },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.TYPE, text: ' Deadline ist der <strong>14.03</strong>!' },
        ]);
        this.typewriterEffectService.animatePlaceholder(this.updatePlaceholder.bind(this));
      }
    }
  }

  public ngOnDestroy(): void {
    const form = this.notificationModel();
    if (this.editorMode() == 'create' && form.content && form.content.length > 0) {
      this.sessionStorage.setItem('notificationDraft', JSON.stringify(form));
    }
    this.editor.destroy();
  }

  private restoreDraftIfExists(): void {
    const draft = this.sessionStorage.getItem('notificationDraft');
    if (draft) {
      const parsedDraft = JSON.parse(draft) as Partial<ReturnType<typeof this.notificationModel>>;
      this.notificationModel.update((current) => ({
        ...current,
        ...parsedDraft,
      }));
      this.showPlaceholderAnimation.set(false);
    }
  }

  private updateNotification(): void {
    const formValue = this.notificationModel();
    const notification = {
      Subject: formValue.subject || this.placeholderSubject,
      Content: formValue.content,
      DueDate: formValue.dateTime.toString(),
      IsDraft: formValue.isDraft,
      Mail: formValue.mail 
    } satisfies Notification_Set_Input;

    this.notificationService.updateNotification(notification, this.notification()!.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError((error) => {
        console.error(`Error updating notification.\n Error message: ${error.message}\n Stack trace: ${error.stack}`);
        this.toastService.showToast('Error updating notification. Please try again.', ToastType.Error);
        this.retry.set(true);
        this.notificationChanged.emit(undefined);
        return EMPTY;
      }),
    ).subscribe(result => {
      this.resetForm();
      this.notificationChanged.emit(result);
    });
  }

  private createNotification(): void {
    const formValue = this.notificationModel();
    const mail = formValue.mail;
    const notification = {
      Subject: formValue.subject || this.placeholderSubject,
      Content: formValue.content,
      DueDate: formValue.dateTime.toString(),
      IsDraft: formValue.isDraft,
      UserId: this.userService.currUser()?.userId,
      Mail: mail
    } satisfies Notification_Insert_Input;

    this.sendingNotification.set(true)
    this.userService.getUserByMailOrCreateUserIfNotExists(mail).pipe(
      delay(500), // prevent race condition when new user is createdand immediately receives a notification
      switchMap((user: IUser) => this.notificationService.createNotification(notification, user)),
      catchError((error) => {
        console.error(`Error creating notification.\n Error message: ${error.message}\n Stack trace: ${error.stack}`);
        this.toastService.showToast('Error creating notification. Please try again.', ToastType.Error);
        this.retry.set(true);
        this.notificationChanged.emit(undefined);
        return EMPTY;
      }),
      finalize(() => {
        this.sendingNotification.set(false);
        this.retry.set(false);
      })
    ).subscribe((result) => {
      this.resetForm();
      this.localStorageService.setUserMail(mail);
      this.localStorageService.increaseSendedNotificationCount();
      if (this.checkIfMaxSendedNotificationCountIsReached()) {
        this.toastService.showToast(
          'Max amount of notifications reached this month',
          ToastType.Warning,
          10000
        );
      }

      this.notificationChanged.emit(result);
    });
  }

  public processSubmit(event: Event): void {
    event.preventDefault();

    if (this.notificationModel().additionalInfo.length > 0) {
      this.toastService.showToast('Bot detected. If you are not a bot, please try again.', ToastType.Error);
      this.notificationForm.additionalInfo().value.set('');
      return;
    }

    if (this.notificationForm().invalid()) {
      return;
    }

    if (this.editorMode() === 'edit') {
      this.updateNotification();
    } else {
      this.createNotification();
    }
  }

  private checkIfMaxSendedNotificationCountIsReached(): boolean {
    const mail = this.localStorageService.getUserMail ?? '';
    const count = this.localStorageService.getSendedNotificationCount(mail);
    const limitReached = count >= this.freeNotificationsLimit();
    this.limitReached.set(limitReached);
    return limitReached;
  }

  private updatePlaceholder(text: string): void {
    this.typedPlaceholder.set(text);
  }

  protected onContentChange(content: string): void {
    this.notificationForm.content().value.set(content ?? '');
  }

  protected hasMailError(kind: string): boolean {
    return this.notificationForm.mail().errors().some((error) => error.kind === kind);
  }

  public resetForm(): void {
    this.notificationModel.set({
      subject: '',
      additionalInfo: '',
      content: '',
      mail: this.localStorageService.getUserMail ?? '',
      dateTime: this.tomorrow,
      isDraft: false,
    });
  }
}