import { ChangeDetectionStrategy, Component, output } from '@angular/core';

export interface NotesFilterChangedEvent {
  searchTerm: string;
  draftsOnly: boolean;
}

@Component({
  selector: 'reme-navbar',
  templateUrl: './navbar.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  public readonly searchChanged = output<NotesFilterChangedEvent>();

  private draftsOnly = false;
  private searchTerm = '';

  protected onSearchTermChanged(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement | null)?.value ?? '';
    this.searchChanged.emit({
      searchTerm: this.searchTerm,
      draftsOnly: this.draftsOnly,
    });
  }

  protected onDraftsOnlyChanged(event: Event): void {
    this.draftsOnly = (event.target as HTMLInputElement | null)?.checked ?? false;
    this.searchChanged.emit({
      searchTerm: this.searchTerm,
      draftsOnly: this.draftsOnly,
    });
  }
}
