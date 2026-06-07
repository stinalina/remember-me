import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'reme-navbar',
  templateUrl: './navbar.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  public readonly searchChanged = output<string>();

  protected onSearchTermChanged(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement | null)?.value ?? '';
    this.searchChanged.emit(searchTerm);
  }
}
