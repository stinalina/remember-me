import { Routes } from '@angular/router';
import { LandingPageComponent } from '@app/anonym-space/pages/landing-page/landing-page';
import { HomeComponent } from '@app/personal-space/home/home.component';
import { memberResolver } from '@app/personal-space/utils/member.resolver';
import { authGuard } from '@app/shared/authentication/auth.guard';
import { MobileNotSupportedComponent } from '@app/anonym-space/pages/mobile-not-supported/mobile-not-supported.component';
import { SelectedTabComponentEnum } from '@app/shared/outlet-container';
import { desktopOnlyGuard } from '@app/shared/utils/guards/desktop-only.guard';

export enum ROUTER_TOKENS {
  LANDING_PAGE = '',
  HOME = 'home',
  IMPRESSUM = 'impressum',
  LOGIN = 'login',
  MOBILE_UNSUPPORTED = 'mobile-not-supported',
}

const desktopRoutes: Routes = [
  {
    path: ROUTER_TOKENS.HOME,
    component: HomeComponent,
    canActivate: [authGuard],
    resolve: {
      member: memberResolver,
    },
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
  },
  {
    path: '**',
    redirectTo: ROUTER_TOKENS.LANDING_PAGE,
  },
];

export const routes: Routes = [
  {
    path: ROUTER_TOKENS.MOBILE_UNSUPPORTED,
    component: MobileNotSupportedComponent,
  },
  {
    path: '',
    canMatch: [desktopOnlyGuard],
    children: desktopRoutes,
  },
  {
    path: '**',
    redirectTo: ROUTER_TOKENS.MOBILE_UNSUPPORTED,
  },
];
