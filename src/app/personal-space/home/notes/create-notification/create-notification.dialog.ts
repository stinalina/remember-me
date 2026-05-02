import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreateNotificationComponent } from '@app/shared/create-notification/create-notification.component';

@Component({
  selector: 'reme-create-dialog',
  templateUrl: './create-notification.dialog.html',
  imports: [
    CommonModule,
    CreateNotificationComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNotificationDialog {
  private dialogRef: DialogRef<void> = inject(DialogRef);
  
  public static open(dialog: Dialog): void {
    const dialogRef = dialog.open<void>(CreateNotificationDialog);
    dialogRef.closed.subscribe((result) => {
      if (result) {
        //TODO update store?
      }
    });
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
