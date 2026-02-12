import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/footer/footer.component';
import { ToastComponent } from '@shared/toast/toast.component';
import { environment } from '@environments/environment';
import { ROUTER_TOKENS } from '@app/app.routes';

@Component({
  selector: 'app-root',
  imports: [
    FooterComponent,
    ToastComponent,
    RouterModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public readonly RouterTokens = ROUTER_TOKENS;
  public readonly version = '1.0.0';
  public readonly env = environment.production ? 'Prod Mode' : 'Dev Mode';
}
