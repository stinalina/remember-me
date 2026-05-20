import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/footer/footer.component';
import { ToastComponent } from '@shared/toast/toast.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-root',
  imports: [
    FooterComponent,
    ToastComponent,
    RouterModule,
  ],
  templateUrl: './app.html',
})
export class App {}
