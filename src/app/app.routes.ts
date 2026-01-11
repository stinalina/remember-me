import { FreeNotificationComponent } from './components/free-notification/free-notification.component';
import { Routes } from '@angular/router';
import { HomePage } from './home/home-page.component';
import { AboutComponent } from './about/about.component';
import { ImpressumComponent } from './impressum/impressum.component';

export enum ROUTER_TOKENS {
  HOME = 'home',
  ABOUT = 'about',
  FREE_NOTIFICATION = 'free-notification',
  CONTACT = 'G_PWP@ruv.de',
  LOGIN = 'login',
  IMPRESSUM = 'impressum',
  AGB = 'agb',
  DATENSCHUTZ = 'datenschutz'
}

export const routes: Routes = [
  {
    path: ROUTER_TOKENS.HOME,
    component: HomePage,
  },
  {
    path: ROUTER_TOKENS.FREE_NOTIFICATION,
    component: FreeNotificationComponent,
  },
  {
    path: ROUTER_TOKENS.ABOUT,
    component: AboutComponent,
  },
  {
    path: ROUTER_TOKENS.IMPRESSUM,
    loadComponent: () => ImpressumComponent
  },
  {
    path: ROUTER_TOKENS.AGB,
    loadComponent: () => ImpressumComponent
  },
  {
    path: ROUTER_TOKENS.DATENSCHUTZ,
    loadComponent: () => ImpressumComponent
  },
  {
    path: '',
    redirectTo: ROUTER_TOKENS.HOME,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: ROUTER_TOKENS.HOME,
  },
];
