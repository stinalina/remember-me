import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from "./local-storage.service";

describe('Local Stoarge Service', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should set and get mail von local storage', () => {
    const mail = 'mail@example.de';
    service.setUserMail(mail);
    const mailFromStorage = service.getUserMail();
    expect(mailFromStorage).toEqual(mail);
  });

  it('should increase sended notification count by 1', () => {
    let count = service.getSendedNotificationCount();
    service.increaseSendedNotificationCount(42);
    let newCount = service.getSendedNotificationCount();
    expect(newCount).toEqual(count+1);
  });

  it('should not increase count when limit if reached', () => {
    let count = service.getSendedNotificationCount();
    service.increaseSendedNotificationCount(count);
    let newCount = service.getSendedNotificationCount();
    expect(newCount).toEqual(count);
  });
});