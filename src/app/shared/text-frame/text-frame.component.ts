import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-text-frame',
  templateUrl: 'text-frame.component.html'
})
export class TextFrameComponent {
  public readonly content = input.required<string>();
  public readonly title = input.required<string>();
}