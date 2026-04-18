import { ElementRef } from "@angular/core";

export enum SelectedTabComponentEnum {
  Home,
  Login,
  Register,
  FreeNotification,
  Impressum,
  Logout,
  Settings,
  Stats,
  Notes,
}

export abstract class OutletContainer {

  protected scrollToOutlet(outletContainerRef: ElementRef): void {
    setTimeout(() => {
      const element = outletContainerRef.nativeElement;
      if (element) {
        const offset = element.offsetTop;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  protected abstract selectTab(tab: SelectedTabComponentEnum): void;
}