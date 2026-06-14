import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { INotification } from '@shared/utils/models/notification.model';
import { NotificationEditorComponent } from '@app/shared/feature/create-notification/notification-editor.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'reme-notification-editor-dialog',
  templateUrl: './notification-editor.dialog.html',
  imports: [
    CommonModule,
    NotificationEditorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationEditorDialog {
  private dialogRef: DialogRef<INotification | undefined> = inject(DialogRef);
  private readonly data = inject(DIALOG_DATA) as { mode: 'create' | 'edit', notification?: INotification };
  protected mode: 'create' | 'edit' = this.data.mode;
  protected notification: INotification | undefined = this.data.notification;

  public static open(dialog: Dialog, mode: 'create' | 'edit', notification?: INotification): Observable<INotification | undefined> {
    return dialog.open<INotification | undefined>(NotificationEditorDialog,
      {
        hasBackdrop: false,
        disableClose: true,
        data: { mode, notification },
        maxWidth: '31rem',
      },
    ).closed;
  }

  protected close(result: INotification | undefined): void {
    this.dialogRef.close(result);
  }
}
