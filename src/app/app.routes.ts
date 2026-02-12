import { Routes } from '@angular/router';
import * as agb from '@assets/text/agb.txt';
import * as dsgvo from '@assets/text/dsgvo.txt';
import { FreeNotificationComponent } from '@components/free-notification/free-notification.component';
import { AboutComponent } from '@pages/about/about.component';
import { HomePage } from '@pages/home/home-page.component';
import { ImpressumComponent } from '@pages/impressum/impressum.component';
import { PricingComponent } from '@pages/pricing/pricing.component';
import { TextFrameComponent } from '@shared/text-frame/text-frame.component';

export enum ROUTER_TOKENS {
  HOME = 'home',
  ABOUT = 'about',
  FREE_NOTIFICATION = 'free-notification',
  CONTACT = 'G_PWP@ruv.de',
  LOGIN = 'login',
  IMPRESSUM = 'impressum',
  AGB = 'agb',
  DATENSCHUTZ = 'dsgvo',
  PRICING = 'pricing'
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
    loadComponent: () => TextFrameComponent,
    resolve: {
      title: () => 'Allgemeine Geschäftsbedingungen',
      content: () => agb.default
    }
  },
  {
    path: ROUTER_TOKENS.DATENSCHUTZ,
    loadComponent: () => TextFrameComponent,
    resolve: {
      title: () => 'Datenschutzerklärung',
      content: () => dsgvo.default
    }
  },
  {
    path: ROUTER_TOKENS.PRICING,
    loadComponent: () => PricingComponent
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
