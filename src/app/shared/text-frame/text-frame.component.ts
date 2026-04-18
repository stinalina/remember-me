import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ContentFrameComponent } from "@app/shared/content-frame/content-rame.component";
import { CheckboxComponent } from "../input/checkbox/checkbox.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-text-frame',
  templateUrl: 'text-frame.component.html',
  imports: [ContentFrameComponent, CheckboxComponent]
})
export class TextFrameComponent {
  public readonly content = input.required<string>();
  public readonly title = input.required<string>();
}