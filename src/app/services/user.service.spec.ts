import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { GetUserByMailGQL, InsertUserGQL } from '@hasura/generated';
import { AuthService } from '@app/shared/authentication/auth.service';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user.service';

const mail = 'test@mail.de';
const mockCurrentUser = signal<{ email: string } | null>(null);
const mockIsAuthenticated = signal<boolean>(false);

const mockAuthService = {
  currentUser: mockCurrentUser,
  isAuthenticated: mockIsAuthenticated,
};

describe('UserService', () => {
  let service: UserService;
  let localStorageService: LocalStorageService;
  let mockGetUserByMailGQL: { fetch: ReturnType<typeof vi.fn> };
  let mockInsertUserGQL: { mutate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockCurrentUser.set(null);
    mockIsAuthenticated.set(false);

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
        { provide: AuthService, useValue: mockAuthService },
        { provide: GetUserByMailGQL, useValue: mockGetUserByMailGQL },
        { provide: InsertUserGQL, useValue: mockInsertUserGQL },
      ]
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

  it('should set currUser when authenticated user is available', () => {
    mockCurrentUser.set({ email: 'test@example.de' });
    mockIsAuthenticated.set(true);
    TestBed.tick();
    expect(mockGetUserByMailGQL.fetch).toHaveBeenCalledWith({ variables: { mail: 'test@example.de' } });
    expect(service.currUser()).toEqual({
      mail: 'test@example.de',
      name: 'Max Mustermann',
      userId: 'user-123',
      newCreated: false,
    });
  });

  it('should set currUser to null when user is not found in database', () => {
    mockGetUserByMailGQL.fetch.mockReturnValue(of({ data: { User: [] } }));
    mockCurrentUser.set({ email: 'unknown@example.de' });
    mockIsAuthenticated.set(true);
    TestBed.tick();
    expect(service.currUser()).toBeNull();
  });
});

