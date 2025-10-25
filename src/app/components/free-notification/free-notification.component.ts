import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateNotificationComponent } from '../../shared/create-notification/create-notification.component';

@Component({
  selector: 'reme-free-notification',
  templateUrl: 'free-notification.component.html',
  styles: [],
  standalone: true,
  imports: [CreateNotificationComponent],
})
export class FreeNotificationComponent {

}