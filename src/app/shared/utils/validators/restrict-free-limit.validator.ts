import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { LocalStorageService } from "@app/services/local-storage.service";

export function restrictFreeLimitValidator(localStorage: LocalStorageService, freeNotificationsLimit: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (localStorage.getSendedNotificationCount(control.value) >= freeNotificationsLimit) {
      return { freeLimitReached: true };
    };

    return null;
  };
}