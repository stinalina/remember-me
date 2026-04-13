import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-impressum',
  templateUrl: 'impressum.component.html',
})
export class ImpressumComponent {}