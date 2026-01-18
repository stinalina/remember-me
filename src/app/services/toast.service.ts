import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  public readonly toastIds = signal<number[]>([]);
  private idCounter: number = 0;

  public showToast(): void {
    const id = ++this.idCounter;
    this.toastIds.update(old => [...old, id]);
    setTimeout((): void => this.remove(id), 3000);
  }

  public remove(idToRemove: number): void {
    this.toastIds.set(this.toastIds().filter((id): boolean => id !== idToRemove));
  }
}