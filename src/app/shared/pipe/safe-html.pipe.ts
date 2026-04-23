import { Pipe, PipeTransform, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  public transform(value: string | null | undefined): SafeHtml {
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, value ?? '');
    return this.sanitizer.bypassSecurityTrustHtml(sanitized ?? '');
  }
}
