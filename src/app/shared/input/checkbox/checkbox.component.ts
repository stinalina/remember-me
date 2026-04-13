import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'reme-checkbox',
  templateUrl: 'checkbox.component.html',
  imports: [
    FormsModule
  ]
})
export class CheckboxComponent {
  public readonly preId = input.required<string>();
  public readonly value = model.required<boolean>();
}