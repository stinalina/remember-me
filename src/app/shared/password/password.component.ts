import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'reme-password',
  templateUrl: 'password.component.html',
  imports: [
    ReactiveFormsModule
  ]
})
export class PasswordComponent {
  public readonly preId = input.required<string>();
  public passwordControl = new FormControl('',
    [
      Validators.required,
      Validators.minLength(6),
    ]
  );
}