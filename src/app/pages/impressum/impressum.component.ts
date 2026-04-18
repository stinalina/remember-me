import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ContentFrameComponent } from "@app/shared/content-frame/content-frame.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-impressum',
  templateUrl: 'impressum.component.html',
  imports: [ContentFrameComponent]
})
export class ImpressumComponent {}