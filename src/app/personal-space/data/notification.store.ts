import { withResource } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { UserService } from '@root/src/app/shared/services/user.service';
import { NotificationService } from '@services/notification.service';
import { ToastService, ToastType } from '@services/toast.service';
import { INotification } from '@shared/utils/models/notification.model';

export const NotificationStore = signalStore(
  { providedIn: 'root' },

  withProps(() => ({
    _notificationService: inject(NotificationService),
    _toastService: inject(ToastService),
    _userService: inject(UserService),
  })),

  withComputed((store) => ({
    _userId: computed(() => store._userService.currUser()?.userId)
  })),
  
  withResource((store) => rxResource({
    stream: () => store._notificationService.loadNotifications(store._userId()),
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
      store._notificationService.deleteNotification(id).subscribe(success => {
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
      store._notificationService.updateNotification(notification).subscribe(result => {
        if (result) {
          const currentNotifications = store.value() ?? [];
          const updatedNotifications = currentNotifications.map(n => n.id === notification.id ? result : n); // replace the old notification with the updated one
          patchState(store, { value: updatedNotifications });
        } else {
          store._toastService.showToast('Ups.. Das Backend ist wohl nicht erreichbar.', ToastType.Error);
        }
      });
    }
  })),
);
