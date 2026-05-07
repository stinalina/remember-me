import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { INotification } from '@app/personal-space/data/notification.model';
import { NotificationEditorComponent } from '@app/shared/create-notification/notification-editor.component';
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
  protected mode: 'create' | 'edit' = inject(DialogRef).config.data;
  
  public static open(dialog: Dialog, mode: 'create' | 'edit'): Observable<INotification | undefined> {
    return dialog.open<INotification | undefined>(NotificationEditorDialog,
      {
        hasBackdrop: false,
        disableClose: true,
        data: mode
      },
    ).closed;
  }

  protected close(result: INotification | undefined): void {
    this.dialogRef.close(result);
  }
}
