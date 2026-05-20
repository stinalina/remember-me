import { withResource } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
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

  withProps((store) => {
    const createdNotesThisMonth = computed(() => {
      const now = new Date();
      return (store.value() ?? []).filter(note => {
        const createdAt = new Date(note.createdAt);
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      });
    });

    return {
      createdNotesThisMonthCount: computed(() => createdNotesThisMonth().length)
    };
  }),

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
    updateNotification(notification: INotification): void {
      const currentNotifications = store.value() ?? [];
      const updatedNotifications = currentNotifications.map(n => n.id === notification.id ? notification : n);
      patchState(store, { value: updatedNotifications });
    }
  })),
);
