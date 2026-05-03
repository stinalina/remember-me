import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypewriterActionType, TypewriterEffectService } from '@app/services/typewriter-effect.service';
import { htmlContentValidator } from '@app/shared/validators/html-content.validator';
import { restrictFreeLimitValidator } from '@app/shared/validators/restrict-free-limit.validator';
import { LocalStorageService } from '@services/local-storage.service';
import { ToastService, ToastType } from '@services/toast.service';
import { UserService } from '@services/user.service';
import { EDITOR_TOOLBAR_MIN_CONFIG_TOKEN } from '@shared/editor-config.token';
import { ICreateNotification } from '@shared/models';
import { SESSION_STORAGE } from '@shared/storage.token';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-create-notification',
  templateUrl: 'create-notification.component.html',
  styleUrl: 'create-notification.component.scss',
  imports: [  
    NgxEditorModule,
    ReactiveFormsModule
  ] 
})
export class CreateNotificationComponent implements OnInit, OnDestroy {
  public readonly createNotificationAction = input.required<(notification: ICreateNotification) => Observable<void>>();

  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly sessionStorage = inject(SESSION_STORAGE);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly toastService = inject(ToastService);
  private readonly typewriterEffectService = inject(TypewriterEffectService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly freeNotificationsLimit = this.userService.freeNotificationsLimit;
  private readonly limitReached = signal<boolean>(false);

  public readonly editor: Editor = new Editor();
  public readonly toolbar: Toolbar = inject(EDITOR_TOOLBAR_MIN_CONFIG_TOKEN);
  
  protected readonly myForm = this.fb.group({
    subject: ['', Validators.maxLength(100)],
    additionalInfo: [''],
    content: ['', htmlContentValidator()],
    mail: [this.localStorageService.getUserMail ?? '',
      [Validators.required, Validators.email, restrictFreeLimitValidator(this.localStorageService, this.freeNotificationsLimit())]],
    dateTime: [this.nextDay, Validators.required],
  });

  protected readonly formStatus = toSignal(this.myForm.statusChanges, {
    initialValue: this.myForm.status,
  });
  public readonly canSubmitForm = computed(() =>  {
    return this.formStatus() === 'VALID';
  });

  protected readonly now = this.nextDay;
  protected readonly retry = signal<boolean>(false);
  protected readonly sendingNotification = signal<boolean>(false);
  protected readonly placeholderSubject = 'Grüße von Notify!';

  public readonly typedPlaceholder = signal('');
  public showPlaceholderAnimation = true;

  private get nextDay(): string {
    const date = new Date();
    const dateTime = new Date(date.getTime() + 24 * 60 * 60 * 1000); // add one day
    return new DatePipe('en-US').transform(dateTime, 'yyyy-MM-dd')!;
  }

  constructor() {
    effect(() => {
      if (this.limitReached()) {
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
        this.showPlaceholderAnimation = true;
        this.typewriterEffectService.animatePlaceholder(this.updatePlaceholder.bind(this));
      }
    });
  }

  public ngOnInit(): void {
    if (!this.checkIfMaxSendedNotificationCountIsReached()) {
      this.restoreDraftIfExists();
    
    if (this.showPlaceholderAnimation) {
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
    const form = this.myForm.value;
    if (form.content && form.content.length > 0) {
      this.sessionStorage.setItem('notificationDraft', JSON.stringify(this.myForm.value));
    }
    this.editor.destroy();
  }

  private restoreDraftIfExists(): void {
    const draft = this.sessionStorage.getItem('notificationDraft');
    if (draft) {
      this.myForm.setValue(JSON.parse(draft));
      this.showPlaceholderAnimation = false;
    }
  }

  public createNotification(): void {
    if (this.myForm.value.additionalInfo && this.myForm.value.additionalInfo.length > 0) {
      this.toastService.showToast('Bot detected. If you are not a bot, please try again.', ToastType.Error);
      this.myForm.value.additionalInfo = '';
      return;
    }
    if (!this.canSubmitForm()) {
      return;
    }

    const notification = {
      subject: this.myForm.value.subject || this.placeholderSubject,
      content: this.myForm.value.content!,
      dueDate: this.myForm.value.dateTime!.toString(),
      mail: this.myForm.value.mail!
    } satisfies ICreateNotification;

    this.sendingNotification.set(true)

    this.createNotificationAction()(notification).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError((error) => {
        console.error(`Error creating notification.\n Error message: ${error.message}\n Stack trace: ${error.stack}`);
        this.toastService.showToast('Error creating notification. Please try again.', ToastType.Error);
        this.retry.set(true);
        return EMPTY;
      }),
      finalize(() => {
        this.sendingNotification.set(false);
        this.retry.set(false);
      })
    ).subscribe(() => {
      this.resetForm();
      this.localStorageService.setUserMail(notification.mail);
      this.localStorageService.increaseSendedNotificationCount();
      if (this.checkIfMaxSendedNotificationCountIsReached()) {
        this.toastService.showToast(
          'Max amount of notifications reached this month',
          ToastType.Warning,
          10000
        );
      }
    });
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

  private resetForm(): void {
    this.myForm.reset({
      subject: '',
      content: '',
      mail: this.localStorageService.getUserMail ?? '',
      dateTime: this.nextDay
    });
  }
}