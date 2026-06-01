import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentFrameComponent } from '@app/shared/ui/content-frame/content-frame.component';

@Component({
  selector: 'reme-mobile-not-supported-page',
  templateUrl: './mobile-not-supported.component.html',
  imports: [ContentFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNotSupportedComponent {}
