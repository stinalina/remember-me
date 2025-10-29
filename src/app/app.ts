import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { ROUTER_TOKENS } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public readonly RouterTokens = ROUTER_TOKENS;
}
