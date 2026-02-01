import { TestBed } from '@angular/core/testing';
import { inject } from "@angular/core";
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
    service.increaseSendedNotificationCount();
    const count = service.getSendedNotificationCount();
    expect(count).toEqual(1);
  });
});