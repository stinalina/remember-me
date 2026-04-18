import { NgTemplateOutlet } from '@angular/common';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { SettingsComponent } from '@app/personal-space/home/settings/settings.component';
import { StatsComponent } from "./stats/stats.component";
import { NotesComponent } from '@app/personal-space/home/notes/notes.component';
import { AuthenticationService } from '@app/services/authentication.service';

enum SelectedTabComponentEnum {
  Home,
  Logout,
  Settings,
  Stats,
  Notes,
}

@Component({
  selector: 'reme-personal-home',
  templateUrl: './home.component.html',
  imports: [
    SettingsComponent,
    NgTemplateOutlet,
    NotesComponent,
    StatsComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly outletContainerRef = viewChild.required<ElementRef>('outletContainer'); //TODO outsource commonn base for landingpage and personal space

  protected readonly authenticationService = inject(AuthenticationService);

  protected readonly SelectedTab = SelectedTabComponentEnum;
  // protected readonly selectedTabComponent = linkedSignal<boolean, SelectedTabComponentEnum>({
  //   source: this.impressumSelected,
  //   computation: (impressumSelected, previous) => {
  //     if (impressumSelected) return SelectedTabComponentEnum.Impressum;
  //     if (previous !== undefined && previous.value !== SelectedTabComponentEnum.Impressum) {
  //       return previous.value;
  //     }
  //     return SelectedTabComponentEnum.Home;
  //   },
  // });
  protected readonly selectedTabComponent = signal<SelectedTabComponentEnum>(SelectedTabComponentEnum.Notes);

  private readonly location = inject(Location);

  selectTab(tab: SelectedTabComponentEnum) {
    this.selectedTabComponent.set(tab);
    // this.location.go('/'); //TODO notwendig?
    // this.scrollToOutlet();
  }

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
