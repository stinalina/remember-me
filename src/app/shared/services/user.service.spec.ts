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
    // Default: Insert erfolgreich (kein Conflict) -> neuer User
    mockInsertUserGQL = {
      mutate: vi.fn().mockReturnValue(
        of({ data: { insert_User: { returning: [{ Name: 'Heinz', Id: 'def-456' }] } } })
      ),
    };

    // Default: SELECT liefert einen bestehenden User (wird für Conflict-Fallback genutzt)
    mockGetUserByMailGQL = {
      fetch: vi.fn().mockReturnValue(
        of({ data: { User: [{ Name: 'Max Mustermann', Id: 'user-123' }] } })
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        UserService,
        { provide: GetUserByMailGQL, useValue: mockGetUserByMailGQL },
        { provide: InsertUserGQL, useValue: mockInsertUserGQL },
      ],
    });

    service = TestBed.inject(UserService);
    localStorageService = TestBed.inject(LocalStorageService);
    window.localStorage.clear();
  });

  it('should create a new user when insert succeeds (no conflict)', async () => {
    const result = await firstValueFrom(service.getUserByMailOrCreateUserIfNotExists(mail));

    expect(mockInsertUserGQL.mutate).toHaveBeenCalledTimes(1);
    expect(mockGetUserByMailGQL.fetch).not.toHaveBeenCalled();
    expect(result.newCreated).toBe(true);
    expect(result.userId).toBe('def-456');
  });

  it('should return existing user when insert reports a conflict (empty returning)', async () => {
    // Hasura on_conflict mit update_columns: [] -> returning ist leer
    mockInsertUserGQL.mutate.mockReturnValue(
      of({ data: { insert_User: { returning: [] } } })
    );
    mockGetUserByMailGQL.fetch.mockReturnValue(
      of({ data: { User: [{ Name: 'Horst', Id: 'abc-123' }] } })
    );

    const result = await firstValueFrom(service.getUserByMailOrCreateUserIfNotExists(mail));

    expect(mockInsertUserGQL.mutate).toHaveBeenCalledTimes(1);
    expect(mockGetUserByMailGQL.fetch).toHaveBeenCalledTimes(1);
    expect(result.newCreated).toBe(false);
    expect(result.userId).toBe('abc-123');
  });

  it('should throw when upsert conflicts but existing user cannot be found', async () => {
    mockInsertUserGQL.mutate.mockReturnValue(
      of({ data: { insert_User: { returning: [] } } })
    );
    mockGetUserByMailGQL.fetch.mockReturnValue(of({ data: { User: [] } }));

    await expect(
      firstValueFrom(service.getUserByMailOrCreateUserIfNotExists(mail))
    ).rejects.toThrow(/could not be resolved after upsert/);
  });

  it('should update created notes count when count changes', () => {
    localStorageService.setUserMail('counter@example.de');
    expect(service.createdNotesThisMonthCount()).toBe(0);
    localStorageService.increaseSendedNotificationCount();
    expect(service.createdNotesThisMonthCount()).toBe(1);
  });
});