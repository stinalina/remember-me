import { withResource } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificationClient } from '@app/personal-space/data/notification.client';
import { INotification } from '@app/personal-space/data/notification.model';
import { ToastService, ToastType } from '@app/services/toast.service';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
} from '@ngrx/signals';

export const NotificationStore = signalStore(
  { providedIn: 'root' },

  withProps(() => ({
    _notificationClient: inject(NotificationClient),
    _toastService: inject(ToastService),
  })),

  withResource((store) => rxResource({
    stream: () => store._notificationClient.loadNotifications(),
    defaultValue: []
    })
  ),

  withMethods((store) => ({
    deleteNotification(id: string): void {
      store._notificationClient.deleteNotification(id).subscribe(success => {
        if (success) {
          patchState(store, { value: store.value()?.filter(n => n.id !== id) ?? [] });
        }
        else {
          store._toastService.showToast('Ups.. Das Backend ist wohl nicht erreichbar.', ToastType.Error);
        }
      });
    },
    insertNotification(notification: INotification): void {
      patchState(store, { value: [notification, ...(store.value() ?? [])] });
    },
  })),
);
