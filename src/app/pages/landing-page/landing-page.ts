import { ChangeDetectionStrategy, Component, ElementRef, input, linkedSignal, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FreeNotificationComponent } from '@app/components/free-notification/free-notification.component';
import { LoginComponent } from '@app/components/login/login.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { HomePage } from '@app/pages/home/home-page.component';
import { ImpressumComponent } from '@app/pages/impressum/impressum.component';
import { ThemeToggleComponent } from '@app/shared/theme-toggle/theme-toggle.component';
import { environment } from '@environments/environment';

enum SelectedTabComponentEnum {
  Home,
  Login,
  Register,
  FreeNotification,
  Impressum
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-landing-page',
  templateUrl: './landing-page.html',
  imports: [
    RouterModule,
    ThemeToggleComponent,
    LoginComponent,
    RegisterComponent,
    FreeNotificationComponent,
    HomePage,
    ImpressumComponent
  ],
})
export class LandingPageComponent {
  public readonly impressumSelected = input(false);
  protected readonly outletContainerRef = viewChild.required<ElementRef>('outletContainer');
  public readonly version = '1.0.0';
  public readonly env = environment.production ? 'Prod Mode' : 'Dev Mode';
  public readonly contactMail = environment.CONTACT_MAIL; 
  public readonly showThemeToggle = !environment.production;

  protected readonly SelectedTab = SelectedTabComponentEnum;
  protected readonly selectedTabComponent = linkedSignal<boolean, SelectedTabComponentEnum>({
    source: this.impressumSelected,
    computation: (impressumSelected, previous) => {
      if (impressumSelected) return SelectedTabComponentEnum.Impressum;
      if (previous !== undefined && previous.value !== SelectedTabComponentEnum.Impressum) {
        return previous.value;
      }
      return SelectedTabComponentEnum.Home;
    },
  });

  scrollToOutlet() {
    setTimeout(() => {
      const element = this.outletContainerRef().nativeElement;
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
