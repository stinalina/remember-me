import { computed, Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[remeAdjustGridColumns]',
  exportAs: 'remeAdjustGridColumns', // without this, the directive instance cannot be accessed in the template to read the gridColumns signal
  host: {
    '(window:resize)': 'updateGridColumns()'
  },
})
export class AdjustGridColumnsDirective {
  private static readonly THREE_XL_BREAKPOINT_PX = 1920;

  public readonly notesCount = input.required<number>();

  public readonly gridColumns = signal(3);

  public readonly trailingGhostCount = computed(() => {
    const columns = this.gridColumns();
    const itemsInGrid = this.notesCount() + 1; // +1 for create placeholder
    return (columns - (itemsInGrid % columns)) % columns;
  });

  constructor() {
    this.updateGridColumns();
  }

  public updateGridColumns(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const columns = window.innerWidth >= AdjustGridColumnsDirective.THREE_XL_BREAKPOINT_PX ? 4 : 3;
    this.gridColumns.set(columns);
  }
}