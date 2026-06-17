import { ChangeDetectionStrategy, Component, output } from '@angular/core';

export interface NotesFilterChangedEvent {
  searchTerm: string;
  draftsOnly: boolean;
  archivedOnly: boolean;
}

@Component({
  selector: 'reme-navbar',
  templateUrl: './navbar.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  public readonly filterChanged = output<NotesFilterChangedEvent>();

  private draftsOnly = false;
  private archivedOnly = false;
  private searchTerm = '';

  protected onSearchTermChanged(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement | null)?.value ?? '';
    this.filterChanged.emit({
      searchTerm: this.searchTerm,
      draftsOnly: this.draftsOnly,
      archivedOnly: this.archivedOnly,
    });
  }

  protected onDraftsOnlyChanged(event: Event): void {
    this.draftsOnly = (event.target as HTMLInputElement | null)?.checked ?? false;
    this.filterChanged.emit({
      searchTerm: this.searchTerm,
      draftsOnly: this.draftsOnly,
      archivedOnly: this.archivedOnly,
    });
  }

  protected onArchivedOnlyChanged(event: Event): void {
    this.archivedOnly = (event.target as HTMLInputElement | null)?.checked ?? false;
    this.filterChanged.emit({
      searchTerm: this.searchTerm,
      draftsOnly: this.draftsOnly,
      archivedOnly: this.archivedOnly,
    });
  }
}
