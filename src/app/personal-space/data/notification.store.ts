import { withResource } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificationClient } from '@app/personal-space/data/notification.client';
import { INotification } from '@app/personal-space/data/notification.model';
import {
  signalStore,
  withProps,
  withState
} from '@ngrx/signals';

type NotificationState = {
  notifications: INotification[];
}

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  
  withState<NotificationState>({
    notifications: [],
  }),

  withProps(() => ({
    _notificationClient: inject(NotificationClient),
  })),

  withResource((store) => rxResource({
    stream: () => store._notificationClient.loadNotifications(),
    defaultValue: []
    })
  ),
);
