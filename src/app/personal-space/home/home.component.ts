import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NotesComponent } from '@app/personal-space/home/notes/notes.component';
import { SettingsComponent } from '@app/personal-space/home/settings/settings.component';
import { AuthService } from '@app/shared/authentication/auth.service';
import { StatsComponent } from "./stats/stats.component";
import { OutletContainer, SelectedTabComponentEnum } from '@app/shared/outlet-container';
import { Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';

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

  private readonly router = inject(Router);
  protected readonly authenticationService = inject(AuthService);

  protected readonly SelectedTab = SelectedTabComponentEnum;
  protected readonly selectedTabComponent = signal<SelectedTabComponentEnum>(SelectedTabComponentEnum.Notes);

  protected override selectTab(tab: SelectedTabComponentEnum): void {
    this.selectedTabComponent.set(tab);
    this.scrollToOutlet(this.outletContainerRef());
  }

  protected logout(): void {
    this.authenticationService.signOut().subscribe(() => 
      this.router.navigate([ROUTER_TOKENS.LOGIN])
    );
  }
}
