import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'reme-content-frame',
  templateUrl: './content-frame.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentFrameComponent {
  public readonly fullHeight = input<boolean>(false);
}
