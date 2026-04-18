import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentFrameComponent } from '@app/shared/content-frame/content-rame.component';

@Component({
  selector: 'reme-personal-notes',
  templateUrl: './notes.component.html',
  imports: [ContentFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent { }
