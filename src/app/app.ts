import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateNotificationComponent } from './shared/create-notification/create-notification.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateNotificationComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('remember-me');
}
