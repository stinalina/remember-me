import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { GetUserByMailGQL, InsertUserGQL } from '@hasura/generated';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user.service';

const mail = 'test@mail.de';

describe('UserService', () => {
  let service: UserService;
  let localStorageService: LocalStorageService;
  let mockGetUserByMailGQL: { fetch: ReturnType<typeof vi.fn> };
  let mockInsertUserGQL: { mutate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockInsertUserGQL = {
      mutate: vi.fn().mockReturnValue(
        of({ data: { insert_User: { returning: [{ Name: 'Heinz', Id: 'def-456' }] } } })
      )
    };

    mockGetUserByMailGQL = {
      fetch: vi.fn().mockReturnValue(
        of({ data: { User: [{ Name: 'Max Mustermann', Id: 'user-123' }] } })
      )
    };

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        UserService,
        { provide: GetUserByMailGQL, useValue: mockGetUserByMailGQL },
        { provide: InsertUserGQL, useValue: mockInsertUserGQL },
      ]
    });

    service = TestBed.inject(UserService);
    localStorageService = TestBed.inject(LocalStorageService);
    window.localStorage.clear();
  });

  it('should create a new user if user does not exist', async () => {
    mockGetUserByMailGQL.fetch.mockReturnValue(of({ data: { User: [] } }));
    const result = await firstValueFrom(service.getUserByMailOrCreateUserIfNotExists(mail));
    expect(mockInsertUserGQL.mutate).toHaveBeenCalled();
    expect(result.newCreated).toBe(true);
  });
  
  it('should return existing user if user exists', async () => {
    mockGetUserByMailGQL.fetch.mockReturnValue(
      of({ data: { User: [{ Name: 'Horst', Id: 'abc-123' }] } })
    );
    const result = await firstValueFrom(service.getUserByMailOrCreateUserIfNotExists(mail));
    expect(mockInsertUserGQL.mutate).not.toHaveBeenCalled();
    expect(result.newCreated).toBe(false);
  });

  it('should update created notes count when count changes', () => {
    localStorageService.setUserMail('counter@example.de');
    expect(service.createdNotesThisMonthCount()).toBe(0);
    localStorageService.increaseSendedNotificationCount();
    expect(service.createdNotesThisMonthCount()).toBe(1);
  });
});

