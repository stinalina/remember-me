import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentFrameComponent } from '@app/shared/content-frame/content-frame.component';

@Component({
  selector: 'reme-personal-settings',
  templateUrl: './settings.component.html',
  imports: [ContentFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent { }
