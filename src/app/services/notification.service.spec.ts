import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { InsertNotificationGQL, Notification_Insert_Input } from '@hasura/generated';
import { IUser } from '@shared/models';
import { firstValueFrom, of, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

describe('NotificationService getUserByMailOrCreateUserIfNotExists', () => {
  let service: NotificationService;

  let mockInsertNotificationGQL: { mutate: ReturnType<typeof vi.fn> };
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

  beforeEach(() => {    mockInsertNotificationGQL = { mutate: vi.fn().mockReturnValue(of({ data: {} })) };
    httpMock = { post: vi.fn().mockReturnValue(of({})) };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: HttpClient, useValue: httpMock },
        { provide: InsertNotificationGQL, useValue: mockInsertNotificationGQL }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should create notification and send email', async () => {
    const result = await firstValueFrom(service.createNotification(notification, user));
    expect(mockInsertNotificationGQL.mutate).toHaveBeenCalled();
    expect(httpMock.post).toHaveBeenCalled();
    console.dir(result);
  });

  it('should return undefined when insert notification failed', async () => {
    mockInsertNotificationGQL.mutate.mockReturnValue(throwError(() => new Error('Insert failed')));
    const result = await firstValueFrom(service.createNotification(notification, user));
    expect(result).toBeUndefined();
  });
});