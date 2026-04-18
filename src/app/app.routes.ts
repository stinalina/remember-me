import { Routes } from '@angular/router';
import { LandingPageComponent } from '@app/pages/landing-page/landing-page';

export enum ROUTER_TOKENS {
  HOME = '',
  IMPRESSUM = 'impressum',
  MYSPACE = 'myspace',
}

export const routes: Routes = [
  {
    path: ROUTER_TOKENS.HOME,
    component: LandingPageComponent,
  },
  {
    path: ROUTER_TOKENS.IMPRESSUM,
    loadComponent: () => LandingPageComponent,
    resolve: {
      impressumSelected: () => true,
    }
  },
  {
    path: ROUTER_TOKENS.MYSPACE,
    loadComponent: () => import('@app/personal-space/home/home.component').then(m => m.HomeComponent),
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
