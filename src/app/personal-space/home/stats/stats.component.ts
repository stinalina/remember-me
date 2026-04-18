import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentFrameComponent } from '@app/shared/content-frame/content-rame.component';

@Component({
  selector: 'reme-personal-stats',
  templateUrl: './stats.component.html',
  imports: [ContentFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent { }
