
import { Component, inject, output } from "@angular/core";
import { ToastService } from "../../services/toast.service";

@Component({
  'selector': 'reme-toast',
  templateUrl: './toast.component.html',
  imports: [],
})
export class ToastComponent {
  public readonly toastService = inject(ToastService);
}