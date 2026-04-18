import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NotesComponent } from '@app/personal-space/home/notes/notes.component';
import { SettingsComponent } from '@app/personal-space/home/settings/settings.component';
import { AuthenticationService } from '@app/services/authentication.service';
import { StatsComponent } from "./stats/stats.component";
import { OutletContainer, SelectedTabComponentEnum } from '@app/shared/outlet-container';

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
export class HomeComponent extends OutletContainer {
  protected readonly outletContainerRef = viewChild.required<ElementRef>('outletContainer');

  protected readonly authenticationService = inject(AuthenticationService);

  protected readonly SelectedTab = SelectedTabComponentEnum;
  protected readonly selectedTabComponent = signal<SelectedTabComponentEnum>(SelectedTabComponentEnum.Notes);

  protected override selectTab(tab: SelectedTabComponentEnum): void {
    this.selectedTabComponent.set(tab);
    this.scrollToOutlet(this.outletContainerRef());
  }
}
