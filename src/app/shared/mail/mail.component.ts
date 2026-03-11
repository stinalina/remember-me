import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '@app/services/local-storage.service';

@Component({
  selector: 'reme-mail',
  templateUrl: 'mail.component.html',
  imports: [ReactiveFormsModule]
})
export class MailComponent {
  private readonly localStorageService = inject(LocalStorageService);
  
  public mailControl = new FormControl(
    this.localStorageService.getUserMail() ?? '',
    [Validators.required, Validators.email]
  );
}