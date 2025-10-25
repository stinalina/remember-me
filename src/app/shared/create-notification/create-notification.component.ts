import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, computed, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'reme-create-notification',
  templateUrl: 'create-notification.component.html',
  styles: [],
  standalone: true,
  imports: [NgxEditorComponent, NgxEditorMenuComponent,
    ReactiveFormsModule] // to get access to FormGroup and the formControlName directive.
})
export class CreateNotificationComponent implements OnDestroy {

  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  
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
  protected readonly sendingNotification = signal<boolean>(false);
  protected readonly placeholderSubject = 'Greetings from Notify!';

  public editor: Editor = new Editor();

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

  public sendNotification(): void {
    if (!this.canSubmitForm()) {
      return;
    }

    const notification = {
      subject: this.myForm.value.subject ||  this.placeholderSubject, // use placeholder if empty
      content: this.myForm.value.content,
      dateTime: this.myForm.value.dateTime,
      mail: this.myForm.value.mail
    };

    this.sendingNotification.set(true);
    this.notificationService.sendNotification().then(() => {
      console.log('Notification sent:', notification);
      this.myForm.reset();
    }).catch((err: unknown) => {
      console.error('Error sending notification:', err);
    }).finally(() => {
      this.sendingNotification.set(false);
    });
  }
}