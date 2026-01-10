import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';
import { catchError, finalize, switchMap, tap } from 'rxjs';
import { EDITOR_TOOLBAR_MIN_CONFIG_TOKEN } from '../editor-config.token';
import { INotification, IUser } from '../models';
import { NotificationService } from '../services/notification.service';

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
export class CreateNotificationComponent implements OnDestroy {
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

  ngOnDestroy(): void {
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
}