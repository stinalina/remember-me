import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'reme-confirm-dialog',
  templateUrl: './confirmation.dialog.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialogRef');

  public readonly title = input('Achtung!');
  public readonly showCancel = input(true);
  public readonly cancelLabel = input('Abbrechen');
  public readonly confirmLabel = input('Bestätigen');
  public readonly confirmButtonClass = input('btn-error');
  public readonly secondaryConfirmLabel = input<string | undefined>(undefined);
  public readonly secondaryConfirmButtonClass = input('btn-warning');
  public readonly confirm = output<void>();
  public readonly secondaryConfirm = output<void>();

  public show(): void {
    this.dialogRef().nativeElement.showModal();
  }

  protected close(): void {
    this.dialogRef().nativeElement.close();
  }

  public onConfirm(): void {
    this.close();
    this.confirm.emit();
  }

  public onSecondaryConfirm(): void {
    this.close();
    this.secondaryConfirm.emit();
  }
}
