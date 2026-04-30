import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'reme-confirm-dialog',
  templateUrl: './confirmation.dialog.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialogRef');

  public readonly warning = input.required<string>();
  public readonly confirm = output<void>();

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
}
