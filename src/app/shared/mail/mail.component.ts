import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '@app/services/local-storage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-mail',
  templateUrl: 'mail.component.html',
  imports: [ReactiveFormsModule]
})
export class MailComponent {
  public readonly preId = input.required<string>();
  public readonly inputLabel = input<string>();
  private readonly localStorageService = inject(LocalStorageService);
  
  public mailControl = new FormControl(
    this.localStorageService.getUserMail() ?? '',
    [Validators.required, Validators.email]
  );
}