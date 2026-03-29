import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypewriterActionType, TypewriterEffectService } from '@app/services/typewriter-effect.service';
import { htmlContentValidator } from '@app/shared/validators/html-content.validator';
import { environment } from '@environments/environment';
import { LocalStorageService } from '@services/local-storage.service';
import { NotificationService } from '@services/notification.service';
import { ToastService, ToastType } from '@services/toast.service';
import { UserService } from '@services/user.service';
import { EDITOR_TOOLBAR_MIN_CONFIG_TOKEN } from '@shared/editor-config.token';
import { INotification, IUser } from '@shared/models';
import { SESSION_STORAGE } from '@shared/storage.token';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';

@Component({
  selector: 'reme-create-notification',
  templateUrl: 'create-notification.component.html',
  styleUrl: 'create-notification.component.scss',
  imports: [  
    NgxEditorModule,
    ReactiveFormsModule
  ] 
})
export class CreateNotificationComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly sessionStorage = inject(SESSION_STORAGE);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly toastService = inject(ToastService);
  private readonly typewriterEffectService = inject(TypewriterEffectService);

  public readonly MVP_Mode = environment.MVP_Mode;

  public readonly editor: Editor = new Editor();
  public readonly toolbar: Toolbar = inject(EDITOR_TOOLBAR_MIN_CONFIG_TOKEN);
  
  protected readonly myForm = this.fb.group({
    subject: [''],
    content: ['', htmlContentValidator()],
    mail: [this.localStorageService.getUserMail() ?? '', [Validators.required, Validators.email]],
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
  protected readonly placeholderSubject = 'Greetings from Notify!';

  private readonly freeNotificationsLimit = inject(UserService).freeNotificationsLimit;
  private readonly limitReached = signal<boolean>(false);

  public typedPlaceholder = '';
  public showPlaceholderAnimation = true;

  private get nextDay(): string {
    const date = new Date();
    const dateTime = new Date(date.getTime() + 24 * 60 * 60 * 1000); // add one day
    return new DatePipe('en-US').transform(dateTime, 'yyyy-MM-dd')!;
  }

  constructor() {
    effect(() => {
      const limitReached = this.limitReached();
      if (limitReached) {
        this.myForm.disable();
        this.myForm.reset();
        this.typewriterEffectService.setActions([
          { type: TypewriterActionType.PAUSE, duration: 1000 },
          { type: TypewriterActionType.TYPE, text: 'Maximum of free notifications reached for this month. So this editor is disabled.' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.PAUSE, duration: 2000 },
          { type: TypewriterActionType.TYPE, text: ' Do you want to create more notificatins?' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.TYPE, text: ' Just hold on!' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.TYPE, text: ' *Reason: This is still in develop mode and every request to the database costs money. In the future there will be an option to create as many notifications as you want.' },
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
    if (!this.canSubmitForm()) {
      return;
    }

    const notification = {
      subject: this.myForm.value.subject || this.placeholderSubject, // use placeholder if empty
      content: this.myForm.value.content!,
      dueDate: this.myForm.value.dateTime!.toString(),
      mail: this.myForm.value.mail!
    } satisfies INotification;

    this.sendingNotification.set(true)
    this.notificationService.getUserByMailOrCreateUserIfNotExists(notification.mail).pipe(
      switchMap((user: IUser) => this.notificationService.createNotification(notification, user)),
      catchError((error) => {
        console.error(`Error creating notification.\n Error message: ${error.message}\n Stack trace: ${error.stack}`);
        this.toastService.showToast('Error creating notification. Please try again.', ToastType.Error);
        this.retry.set(true);
        return EMPTY;
      }),
      finalize(() => {
        this.sendingNotification.set(false);
        this.retry.set(false);
        this.localStorageService.setUserMail(notification.mail);
      })
    ).subscribe(() => {
      this.myForm.reset({
        subject: '',
        content: '',
        mail: this.localStorageService.getUserMail() ?? '',
        dateTime: this.nextDay
      });

      this.localStorageService.increaseSendedNotificationCount(); //TODO limit should set based on pricing when user is logged in!
      
      if (this.checkIfMaxSendedNotificationCountIsReached()) {
        this.toastService.showToast(
          'Max amount of notifications reached this month',
          ToastType.Warning
        );
      }
    });
  }

  private checkIfMaxSendedNotificationCountIsReached(): boolean {
    const count = this.localStorageService.getSendedNotificationCount();
    const limitReached = count >= this.freeNotificationsLimit();
    this.limitReached.set(limitReached);
    return limitReached;
  }

  private updatePlaceholder(text: string): void {
    this.typedPlaceholder = text;
  }
}