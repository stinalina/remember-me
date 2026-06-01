import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { InsertNotificationGQL, Notification_Insert_Input, Notification_Set_Input, UpdateNotificationByIdGQL } from '@hasura/generated';

import { firstValueFrom, of, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { IUser } from '@app/shared/models/user.model';

const mockNotificationReturning = {
  Id: 'abc-123',
  Subject: 'Test Subject',
  Content: 'Test Notification',
  DueDate: new Date().toDateString(),
  CreatedAt: new Date().toDateString(),
  UserId: 'def-456',
  RememberCount: 0,
};

describe('NotificationService createNotification', () => {
  let service: NotificationService;

  let mockInsertNotificationGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockUpdateNotificationGQL: { mutate: ReturnType<typeof vi.fn> };
  let httpMock: { post: ReturnType<typeof vi.fn> };

  const mail = 'test@mail.de';
  const notification = {
    Content: 'Test Notification',
    DueDate: new Date().toDateString(),
    Subject: 'Test Subject',
    UserId: 'def-456'
  } satisfies Notification_Insert_Input;
  const user: IUser = {
    mail,
    name: 'Heinz',
    userId: 'def-456',
    newCreated: true
  };

  beforeEach(() => {
    mockInsertNotificationGQL = {
      mutate: vi.fn().mockReturnValue(of({ data: { insert_Notification: { returning: [mockNotificationReturning] } } }))
    };
    mockUpdateNotificationGQL = { mutate: vi.fn() };
    httpMock = { post: vi.fn().mockReturnValue(of({})) };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: HttpClient, useValue: httpMock },
        { provide: InsertNotificationGQL, useValue: mockInsertNotificationGQL },
        { provide: UpdateNotificationByIdGQL, useValue: mockUpdateNotificationGQL }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should create notification and send welcome email for new user', async () => {
    const result = await firstValueFrom(service.createNotification(notification, user));
    expect(mockInsertNotificationGQL.mutate).toHaveBeenCalled();
    expect(httpMock.post).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result?.id).toBe(mockNotificationReturning.Id);
  });

  it('should not send welcome email for existing user', async () => {
    const existingUser: IUser = { ...user, newCreated: false };
    await firstValueFrom(service.createNotification(notification, existingUser));
    expect(httpMock.post).not.toHaveBeenCalled();
  });

  it('should return undefined when insert notification returns no data', async () => {
    mockInsertNotificationGQL.mutate.mockReturnValue(of({ data: { insert_Notification: { returning: [] } } }));
    const result = await firstValueFrom(service.createNotification(notification, user));
    expect(result).toBeUndefined();
  });

  it('should return undefined when insert notification failed', async () => {
    mockInsertNotificationGQL.mutate.mockReturnValue(throwError(() => new Error('Insert failed')));
    const result = await firstValueFrom(service.createNotification(notification, user));
    expect(result).toBeUndefined();
  });
});

describe('NotificationService updateNotification', () => {
  let service: NotificationService;

  let mockInsertNotificationGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockUpdateNotificationGQL: { mutate: ReturnType<typeof vi.fn> };
  let httpMock: { post: ReturnType<typeof vi.fn> };

  const notificationUpdate = {
    Content: 'Updated Content',
    Subject: 'Updated Subject',
    DueDate: new Date().toDateString(),
  } satisfies Notification_Set_Input;

  beforeEach(() => {
    mockInsertNotificationGQL = { mutate: vi.fn() };
    mockUpdateNotificationGQL = {
      mutate: vi.fn().mockReturnValue(of({ data: { update_Notification_by_pk: mockNotificationReturning } }))
    };
    httpMock = { post: vi.fn().mockReturnValue(of({})) };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: HttpClient, useValue: httpMock },
        { provide: InsertNotificationGQL, useValue: mockInsertNotificationGQL },
        { provide: UpdateNotificationByIdGQL, useValue: mockUpdateNotificationGQL }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should update notification and return mapped result', async () => {
    const result = await firstValueFrom(service.updateNotification(notificationUpdate, 'abc-123'));
    expect(mockUpdateNotificationGQL.mutate).toHaveBeenCalledWith({ variables: { id: 'abc-123', object: notificationUpdate } });
    expect(result).toBeDefined();
    expect(result?.id).toBe(mockNotificationReturning.Id);
    expect(result?.subject).toBe(mockNotificationReturning.Subject);
    expect(result?.content).toBe(mockNotificationReturning.Content);
  });

  it('should return undefined when update returns no data', async () => {
    mockUpdateNotificationGQL.mutate.mockReturnValue(of({ data: { update_Notification_by_pk: null } }));
    const result = await firstValueFrom(service.updateNotification(notificationUpdate, 'abc-123'));
    expect(result).toBeUndefined();
  });

  it('should return undefined when update mutation fails', async () => {
    mockUpdateNotificationGQL.mutate.mockReturnValue(throwError(() => new Error('Update failed')));
    const result = await firstValueFrom(service.updateNotification(notificationUpdate, 'abc-123'));
    expect(result).toBeUndefined();
  });
});