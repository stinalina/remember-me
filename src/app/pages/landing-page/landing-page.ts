import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, linkedSignal, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FreeNotificationComponent } from '@app/components/free-notification/free-notification.component';
import { LoginComponent } from '@app/components/login/login.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { HomePage } from '@app/pages/home/home-page.component';
import { ImpressumComponent } from '@app/pages/impressum/impressum.component';
import { AuthService } from '@app/shared/authentication/auth.service';
import { OutletContainer, SelectedTabComponentEnum } from '@app/shared/outlet-container';
import { ThemeToggleComponent } from '@app/shared/theme-toggle/theme-toggle.component';
import { environment } from '@environments/environment';
import { ROUTER_TOKENS } from './../../app.routes';

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
export class LandingPageComponent extends OutletContainer {
  public readonly selectedTab = input(SelectedTabComponentEnum.Home);

  protected readonly outletContainerRef = viewChild.required<ElementRef>('outletContainer');
  public readonly showThemeToggle = !environment.production;

  protected readonly SelectedTabEnum = SelectedTabComponentEnum;
  protected readonly selectedTabComponent = linkedSignal(this.selectedTab);

  private readonly location = inject(Location);
  private readonly authService = inject(AuthService);
  private readonly routes = inject (Router);

  constructor() {
    super();
    effect(() => {
      if (this.selectedTabComponent() === SelectedTabComponentEnum.Login && this.authService.isAuthenticated()) {
        this.routes.navigate([ROUTER_TOKENS.HOME]);
      }
    });
  }
  protected override selectTab(tab: SelectedTabComponentEnum): void {
    this.selectedTabComponent.set(tab);
    if (tab !== SelectedTabComponentEnum.Impressum) {
      this.location.go('/');
    }
    this.scrollToOutlet(this.outletContainerRef());
  }
}
