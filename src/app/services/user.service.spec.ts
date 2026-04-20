import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let localStorageService: LocalStorageService;
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService, UserService]
    });
    service = TestBed.inject(UserService);
    localStorageService = TestBed.inject(LocalStorageService);
    window.localStorage.clear();
  });

  it('should update username when user mail changes', () => {
    expect(service.username()).toBeNull();

    localStorageService.setUserMail('new.user@example.de');

    expect(service.username()).toBe('new.user');
  });

  it('should update created notes count when count changes', () => {
    localStorageService.setUserMail('counter@example.de');
    expect(service.createdNotesThisMonthCount()).toBe(0);

    localStorageService.increaseSendedNotificationCount();

    expect(service.createdNotesThisMonthCount()).toBe(1);
  });
});
