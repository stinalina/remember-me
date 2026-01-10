import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';
import { catchError, finalize, switchMap, tap } from 'rxjs';
import { EDITOR_TOOLBAR_MIN_CONFIG_TOKEN } from '../editor-config.token';
import { INotification, IUser } from '../models';
import { NotificationService } from '../services/notification.service';

enum TypewriterActionType {
  TYPE = 'type',
  DELETE = 'delete',
  PAUSE = 'pause'
}
type TypewriterAction =
  | { type: TypewriterActionType.TYPE; text: string }
  | { type: TypewriterActionType.DELETE; count: number }
  | { type: TypewriterActionType.PAUSE; duration: number };

@Component({
  selector: 'reme-create-notification',
  templateUrl: 'create-notification.component.html',
  styleUrl: 'create-notification.component.scss',
  imports: [
    NgxEditorComponent,
    NgxEditorMenuComponent,
    ReactiveFormsModule // to get access to FormGroup and the formControlName directive.
  ] 
})
export class CreateNotificationComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  public readonly editor: Editor = new Editor();
  public readonly toolbar: Toolbar = inject(EDITOR_TOOLBAR_MIN_CONFIG_TOKEN);
  
  protected readonly myForm = this.fb.group({
    subject: [''],
    content: ['', Validators.required],
    mail: ['', [Validators.required, Validators.email]],
    dateTime: [this.getNextDay(), Validators.required],
  });

  protected readonly formStatus = toSignal(this.myForm.statusChanges, {
    initialValue: this.myForm.status,
  });
  public readonly canSubmitForm = computed(() =>  {
    return this.formStatus() === 'VALID';
  });

  protected readonly now = this.getNextDay();
  protected readonly retry = signal<boolean>(false);
  protected readonly sendingNotification = signal<boolean>(false);
  protected readonly placeholderSubject = 'Greetings from Notify!';
  
  public typedPlaceholder = '';
  public showPlaceholderAnimation = true;
  private actions: TypewriterAction[] = [];
  private readonly cursorHtml = '<span class="typewriter-cursor">|</span>';

  private getNextDay(): string {
    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0')
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate() + 1) +
      'T' +
      '00:30'
    )
  }

  public ngOnInit(): void {
    this.actions = [
      { type: TypewriterActionType.PAUSE, duration: 1000 },
      { type: TypewriterActionType.TYPE, text: 'Im März diesmal wirklich dran denken Tickets für das Sommerfes' },
      { type: TypewriterActionType.PAUSE, duration: 3000 },
      { type: TypewriterActionType.DELETE, count: 13 },
      { type: TypewriterActionType.TYPE, text: 'Rock am Ring zu kaufen.</br>' },
      { type: TypewriterActionType.PAUSE, duration: 500 },
      { type: TypewriterActionType.TYPE, text: ' Manu auch einladen.</br>' },
      { type: TypewriterActionType.PAUSE, duration: 2000 },
      { type: TypewriterActionType.TYPE, text: ' Für Lisa die Mütze mitbringen, die sie beim Weihnachtsmarktbesuch vergessen hat.' },
      { type: TypewriterActionType.PAUSE, duration: 1000 }
    ];
    this.animatePlaceholder();
  }

  public ngOnDestroy(): void {
    this.editor.destroy();
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

    this.notificationService.getUserByMailOrCreateUserIfNotExists(notification.mail).pipe(
      tap(() => this.sendingNotification.set(true)),
      switchMap((user: IUser) => this.notificationService.createNotification(notification, user)),
      catchError((error) => {
        console.error('Error creating notification.');
        throw error;
      }),
      finalize(() => {
        this.sendingNotification.set(false);
        this.retry.set(true);
      })
    ).subscribe(() => {
      console.log('Notification sent:', notification);
      this.myForm.reset();
      this.retry.set(false);
    });
  }

  private animatePlaceholder(): void {
    let i = 0;
    let text = '';
    const typingSpeed = 100; // ms pro Buchstabe

    const nextAction = () => {
      if (i >= this.actions.length) return;
      const action = this.actions[i];

      switch (action.type) {
        case TypewriterActionType.PAUSE:
          if (action.duration <= 500 || i === 0) {
            setTimeout(() => {
              i++;
              nextAction();
            }, action.duration);
          } else {
            let dots = 0;
            const maxDots = 3;
            const dotInterval = 400;
            let elapsed = 0;
            this.typedPlaceholder = text + '<span class="typewriter-cursor"> ...</span>';
            const interval = setInterval(() => {
              dots = (dots + 1) % (maxDots + 1);
              const dotsStr = '.'.repeat(dots);
              this.typedPlaceholder = text + `<span class="typewriter-cursor">${dotsStr}</span>`;
              elapsed += dotInterval;
              if (elapsed >= action.duration) {
                clearInterval(interval);
                this.typedPlaceholder = text;
                i++;
                nextAction();
              }
            }, dotInterval);
          }
          break;
        case TypewriterActionType.TYPE:
          let j = 0;
          const typeInterval = setInterval(() => {
            if (j < action.text.length) {
              text += action.text[j];
              this.typedPlaceholder = text + this.cursorHtml;
              j++;
            } else {
              clearInterval(typeInterval);
              i++;
              nextAction();
            }
          }, typingSpeed);
          break;
        case TypewriterActionType.DELETE:
          let k = 0;
          const deleteInterval = setInterval(() => {
            if (k < action.count && text.length > 0) {
              text = text.slice(0, -1);
              this.typedPlaceholder = text + this.cursorHtml;
              k++;
            } else {
              clearInterval(deleteInterval);
              i++;
              nextAction();
            }
          }, typingSpeed);
          break;
      }
    };
    nextAction();
  }
}