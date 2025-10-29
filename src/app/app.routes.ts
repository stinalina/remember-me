import { FreeNotificationComponent } from './components/free-notification/free-notification.component';
import { Routes } from '@angular/router';
import { HomePage } from './home/home-page.component';
import { AboutComponent } from './about/about.component';

export enum ROUTER_TOKENS {
  HOME = 'home',
  ABOUT = 'about',
  FREE_NOTIFICATION = 'free-notification',
  CONTACT = 'G_PWP@ruv.de',
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
    path: '',
    redirectTo: ROUTER_TOKENS.HOME,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: ROUTER_TOKENS.HOME,
  },
];
