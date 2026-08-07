import { TestBed } from '@angular/core/testing';

import { AdjustGridColumnsDirective } from './adjust-grid-columns.directive';

describe('AdjustGridColumnsDirective', () => {
  let originalInnerWidth: number;

  const createDirective = () =>
    TestBed.runInInjectionContext(() => new AdjustGridColumnsDirective());

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
  });

  it('should use three columns below the 3xl breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1600,
    });

    const directive = createDirective();

    expect(directive.gridColumns()).toBe(3);
  });

  it('should use four columns from the 3xl breakpoint onwards', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 2200,
    });

    const directive = createDirective();

    expect(directive.gridColumns()).toBe(4);
  });

  it('should calculate trailing ghost items based on columns and notes count', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 2200,
    });

    const directive = createDirective();
    (directive as { notesCount: () => number }).notesCount = () => 5;

    expect(directive.trailingGhostCount()).toBe(2);
  });
});