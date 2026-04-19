import { Routes } from '@angular/router';
import { LandingPageComponent } from '@app/pages/landing-page/landing-page';
import { HomeComponent } from '@app/personal-space/home/home.component';
import { authGuard } from '@app/shared/authentication/auth.guard';
import { SelectedTabComponentEnum } from '@app/shared/outlet-container';

export enum ROUTER_TOKENS {
  LANDING_PAGE = '',
  HOME = 'home',
  IMPRESSUM = 'impressum',
  LOGIN = 'login',
}

export const routes: Routes = [
  {
    path: ROUTER_TOKENS.HOME,
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: ROUTER_TOKENS.LANDING_PAGE,
    component: LandingPageComponent,
  },
  {
    path: ROUTER_TOKENS.IMPRESSUM,
    component: LandingPageComponent,
    resolve: {
      selectedTab: () => SelectedTabComponentEnum.Impressum,
    }
  },
  {
    path: ROUTER_TOKENS.LOGIN,
    component: LandingPageComponent,
    resolve: {
      selectedTab: () => SelectedTabComponentEnum.Login,
    }
  },  {
    path: '',
    redirectTo: ROUTER_TOKENS.LANDING_PAGE,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: ROUTER_TOKENS.LANDING_PAGE,
  },
];
