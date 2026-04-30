import { withResource } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificationClient } from '@app/personal-space/data/notification.client';
import {
  signalStore,
  withMethods,
  withProps,
} from '@ngrx/signals';

export const NotificationStore = signalStore(
  { providedIn: 'root' },

  withProps(() => ({
    _notificationClient: inject(NotificationClient),
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
          store._reload();
        }
      });
    }
  })),
);
