import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/ui/footer/footer.component';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import * as dsgvo from '@assets/text/dsgvo.txt';
import { ModalComponent } from '@root/src/app/shared/ui/modal/modal.component';
import { TextFrameComponent } from '@root/src/app/shared/ui/text-frame/text-frame.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-root',
  imports: [
    FooterComponent,
    ToastComponent,
    RouterModule,
    ModalComponent,
    TextFrameComponent
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly DsgvoText = dsgvo.default;
}
