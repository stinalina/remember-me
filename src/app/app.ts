import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DaisyUiToasterComponent } from 'daisyui-toaster';
import { environment } from '../../environment';
import { ROUTER_TOKENS } from './app.routes';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    DaisyUiToasterComponent,
    FooterComponent,
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
