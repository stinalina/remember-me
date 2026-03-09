import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/footer/footer.component';
import { ToastComponent } from '@shared/toast/toast.component';
import { environment } from '@environments/environment';
import { ROUTER_TOKENS } from '@app/app.routes';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    FooterComponent,
    ToastComponent,
    RouterModule,
    NgTemplateOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('outletContainer') outletContainer!: ElementRef;
  public readonly RouterTokens = ROUTER_TOKENS;
  public readonly version = '1.0.0';
  public readonly env = environment.production ? 'Prod Mode' : 'Dev Mode';
  public readonly contactMail = environment.CONTACT_MAIL; 

  scrollToOutlet() {
    setTimeout(() => {
      const element = this.outletContainer?.nativeElement;
      if (element) {
        const offset = element.offsetTop;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 150);
  }
}
