import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { ThemeToggleComponent } from '@app/shared/theme-toggle/theme-toggle.component';
import { environment } from '@environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-landing-page',
  templateUrl: './landing-page.html',
  imports: [
    RouterModule,
    ThemeToggleComponent
  ],
})
export class LandingPage {
@ViewChild('outletContainer') outletContainer!: ElementRef;
  public readonly RouterTokens = ROUTER_TOKENS;
  public readonly version = '1.0.0';
  public readonly env = environment.production ? 'Prod Mode' : 'Dev Mode';
  public readonly contactMail = environment.CONTACT_MAIL; 
  public readonly showThemeToggle = !environment.production;

  scrollToOutlet() {
    setTimeout(() => {
      const element = this.outletContainer?.nativeElement;
      if (element) {
        const offset = element.offsetTop;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 150);
  }
}
