import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from "./local-storage.service";

describe('Local Stoarge Service', () => {
  let service: LocalStorageService;
  const mail = 'mail@example.de';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject(LocalStorageService);
    window.localStorage.clear(); //same condition as in worker job
  });

  it('should set and get mail von local storage', () => {
    service.setUserMail(mail);
    const mailFromStorage = service.getUserMail;
    expect(mailFromStorage).toEqual(mail);
  });

  it('should increase sended notification count by 1', () => {
    service.setUserMail(mail);
    const count = service.getSendedNotificationCount(mail);
    service.increaseSendedNotificationCount(10000);
    const newCount = service.getSendedNotificationCount(mail);
    expect(newCount).toEqual(count+1);
  });

  it('should not increase count when limit if reached but min 1 when limit was 0', () => {
    service.setUserMail(mail);
    const count = service.getSendedNotificationCount(mail);
    service.increaseSendedNotificationCount(count);
    const newCount = service.getSendedNotificationCount(mail);
    expect(newCount).toEqual(count === 0 ? 1 : count);
  });

  it('should reset count to 1 when stored month differs from current month', () => {
    service.setUserMail(mail);
    // Seed a stale entry from a previous month with a high count
    const previousMonth = (new Date().getMonth() + 11) % 12;
    const staleCount = 42;
    const key = `sended_notifications_count_${mail}`;
    window.localStorage.setItem(key, `${staleCount}_${previousMonth}`);

    service.increaseSendedNotificationCount(10000);

    const newCount = service.getSendedNotificationCount(mail);
    expect(newCount).toEqual(1);
  });
});