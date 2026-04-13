import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { environment } from '@environments/environment';
import { NgTemplateOutlet } from 'node_modules/@angular/common/types/_common_module-chunk';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
  imports: [
    NgTemplateOutlet,
    RouterLink
  ]
})
export class FooterComponent {
  public readonly RouterTokens = ROUTER_TOKENS;
  public readonly version = '1.0.0';
  public readonly env = environment.production ? 'Prod Mode' : 'Dev Mode';
  public readonly contactMail = environment.CONTACT_MAIL; 
}