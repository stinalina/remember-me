import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { InsertNotificationGQL } from '@hasura/generated';
import { INotification, IUser } from '@shared/models';
import { firstValueFrom, of, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

describe('NotificationService getUserByMailOrCreateUserIfNotExists', () => {
  let service: NotificationService;

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
    mockInsertNotificationGQL = { mutate: vi.fn().mockReturnValue(of({ data: {} })) };
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
    expect(result).toBe(true);
  });

  it('should return false when insert notification failed', async () => {
    mockInsertNotificationGQL.mutate.mockReturnValue(throwError(() => new Error('Insert failed')));
    const result = await firstValueFrom(service.createNotification(notification, user));
    expect(result).toBe(false);
  });
});