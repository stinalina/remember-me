import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { GetUserByMailGQL, InsertNotificationGQL, InsertUserGQL } from '@hasura/generated';
import { INotification, IUser } from '@shared/models';
import { NotificationService } from './notification.service';

describe('NotificationService getUserByMailOrCreateUserIfNotExists', () => {
  let service: NotificationService;

  let mockGetUserByMailGQL: { fetch: ReturnType<typeof vi.fn> };
  let mockInsertUserGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockInsertNotificationGQL: { mutate: ReturnType<typeof vi.fn> };
  let httpMock: { post: ReturnType<typeof vi.fn> };

  const mail = 'test@mail.de';
  const notification: INotification = {
    content: 'Test Notification',
    dueDate: new Date().toDateString(),
    subject: 'Test Subject',
    mail
  };
  const user: IUser = {
    mail,
    name: 'Heinz',
    userId: 'def-456',
    newCreated: true
  };

  beforeEach(() => {
    mockGetUserByMailGQL = { fetch: vi.fn().mockReturnValue(of({ data: { User: [] } })) };
    mockInsertUserGQL = {
      mutate: vi.fn().mockReturnValue(
        of({ data: { insert_User: { returning: [{ Name: 'Heinz', Id: 'def-456' }] } } })
      )
    };
    mockInsertNotificationGQL = { mutate: vi.fn().mockReturnValue(of({ data: {} })) };
    httpMock = { post: vi.fn().mockReturnValue(of({})) };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: HttpClient, useValue: httpMock },
        { provide: GetUserByMailGQL, useValue: mockGetUserByMailGQL },
        { provide: InsertUserGQL, useValue: mockInsertUserGQL },
        { provide: InsertNotificationGQL, useValue: mockInsertNotificationGQL }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should create a new user if user does not exist', async () => {
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

  it('should create notification and send email', async () => {
    const result = await firstValueFrom(service.createNotification(notification, user));
    expect(mockInsertNotificationGQL.mutate).toHaveBeenCalled();
    expect(httpMock.post).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when insert notification failed', async () => {
    mockInsertNotificationGQL.mutate.mockReturnValue(throwError(() => new Error('Insert failed')));
    const result = await firstValueFrom(service.createNotification(notification, user));
    expect(result).toBe(false);
  });
});