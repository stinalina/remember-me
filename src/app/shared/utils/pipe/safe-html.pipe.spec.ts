import { TestBed } from '@angular/core/testing';
import { SafeHtml } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';

function unwrap(safeHtml: SafeHtml): string {
  return (safeHtml as unknown as { changingThisBreaksApplicationSecurity: string }).changingThisBreaksApplicationSecurity;
}

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pipe = TestBed.runInInjectionContext(() => new SafeHtmlPipe());
  });

  it('should pass through safe HTML content', () => {
    const result = pipe.transform('<p>Hello <strong>World</strong></p>');
    expect(unwrap(result)).toContain('Hello');
  });

  it('should strip script tags', () => {
    const result = pipe.transform('<p>Safe</p><script>alert("xss")</script>');
    const output = unwrap(result);
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('alert');
    expect(output).toContain('Safe');
  });

  it('should strip inline event handlers', () => {
    const result = pipe.transform('<img src="x" onerror="alert(1)">');
    expect(unwrap(result)).not.toContain('onerror');
  });

  it('should neutralize javascript: href by prefixing with unsafe:', () => {
    const result = pipe.transform('<a href="javascript:alert(1)">click</a>');
    const output = unwrap(result);
    // Angular sanitizer marks dangerous URLs as inert with 'unsafe:' prefix
    expect(output).toContain('unsafe:javascript:');
  });

  it('should return empty string for null input', () => {
    const result = pipe.transform(null);
    expect(unwrap(result)).toBe('');
  });

  it('should return empty string for undefined input', () => {
    const result = pipe.transform(undefined);
    expect(unwrap(result)).toBe('');
  });

  it('should preserve allowed formatting tags', () => {
    const input = '<p><b>bold</b> and <i>italic</i> and <u>underline</u></p>';
    const output = unwrap(pipe.transform(input));
    expect(output).toContain('bold');
    expect(output).toContain('italic');
    expect(output).toContain('underline');
  });
});
