import { FormControl } from '@angular/forms';
import { LocalStorageService } from '@services/local-storage.service';
import { restrictFreeLimitValidator } from './restrict-free-limit.validator';

describe('restrictFreeLimitValidator', () => {
  it('should return freeLimitReached when the limit is reached', () => {
    const localStorage = {
      getSendedNotificationCount: vi.fn().mockReturnValue(3),
    } as Pick<LocalStorageService, 'getSendedNotificationCount'> as LocalStorageService;
    const validator = restrictFreeLimitValidator(localStorage, 3);

    expect(validator(new FormControl('mail@example.de'))).toEqual({ freeLimitReached: true });
    expect(localStorage.getSendedNotificationCount).toHaveBeenCalledWith('mail@example.de');
  });

  it('should return null when the limit is not reached', () => {
    const localStorage = {
      getSendedNotificationCount: vi.fn().mockReturnValue(2),
    } as Pick<LocalStorageService, 'getSendedNotificationCount'> as LocalStorageService;
    const validator = restrictFreeLimitValidator(localStorage, 3);

    expect(validator(new FormControl('mail@example.de'))).toBeNull();
  });
});