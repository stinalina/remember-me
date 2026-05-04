import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { INotification } from '@app/personal-space/data/notification.model';
import { CreateNotificationComponent } from '@app/shared/create-notification/create-notification.component';
import { Observable } from 'rxjs';

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
  private dialogRef: DialogRef<INotification | undefined> = inject(DialogRef);
  
  public static open(dialog: Dialog): Observable<INotification | undefined> {
    return dialog.open<INotification | undefined>(CreateNotificationDialog,
      {
        hasBackdrop: false,
        disableClose: true
      }
    ).closed;
  }

  protected close(result: INotification | undefined): void {
    this.dialogRef.close(result);
  }
}
