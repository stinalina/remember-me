import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import {
  DeleteNotificationByIdGQL,
  DeleteNotificationsByUserIdGQL,
  GetNotificationByUserIdGQL,
  InsertNotificationGQL,
  UpdateNotificationByIdGQL,
} from '@hasura/generated';
import { ToastService, ToastType } from '@services/toast.service';
import { firstValueFrom, of, throwError } from 'rxjs';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockHttpClient: { post: ReturnType<typeof vi.fn> };
  let mockToastService: { showToast: ReturnType<typeof vi.fn> };
  let mockInsertNotificationGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockUpdateNotificationGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockDeleteNotificationByIdGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockGetNotificationByUserIdGQL: { fetch: ReturnType<typeof vi.fn> };
  let mockDeleteNotificationsByUserIdGQL: { mutate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn().mockReturnValue(of({})),
    };
    mockToastService = {
      showToast: vi.fn(),
    };
    mockInsertNotificationGQL = {
      mutate: vi.fn(),
    };
    mockUpdateNotificationGQL = {
      mutate: vi.fn(),
    };
    mockDeleteNotificationByIdGQL = {
      mutate: vi.fn(),
    };
    mockGetNotificationByUserIdGQL = {
      fetch: vi.fn(),
    };
    mockDeleteNotificationsByUserIdGQL = {
      mutate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: ToastService, useValue: mockToastService },
        { provide: InsertNotificationGQL, useValue: mockInsertNotificationGQL },
        { provide: UpdateNotificationByIdGQL, useValue: mockUpdateNotificationGQL },
        { provide: DeleteNotificationByIdGQL, useValue: mockDeleteNotificationByIdGQL },
        { provide: GetNotificationByUserIdGQL, useValue: mockGetNotificationByUserIdGQL },
        { provide: DeleteNotificationsByUserIdGQL, useValue: mockDeleteNotificationsByUserIdGQL },
      ],
    });

    service = TestBed.inject(NotificationService);
    vi.clearAllMocks();
  });

  it('should create a notification, map the response and send a welcome mail for new users', async () => {
    mockInsertNotificationGQL.mutate.mockReturnValue(
      of({
        data: {
          insert_Notification: {
            returning: [{
              Id: 'n-1',
              Subject: 'Subject',
              Content: 'Body',
              DueDate: '2026-08-07',
              CreatedAt: '2026-08-06',
              Mail: 'max@example.de',
              IsDraft: false,
              IsArchived: false,
            }],
          },
        },
      }),
    );

    await expect(
      firstValueFrom(
        service.createNotification(
          { Subject: 'Subject', Content: 'Body' },
          { mail: 'max@example.de', name: 'Max', userId: 'u-1', newCreated: true },
        ),
      ),
    ).resolves.toEqual({
      id: 'n-1',
      subject: 'Subject',
      content: 'Body',
      dueDate: '2026-08-07',
      createdAt: '2026-08-06',
      mail: 'max@example.de',
      isDraft: false,
      isArchived: false,
    });
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Notification created successfully!',
      ToastType.Success,
    );
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      `${environment.BACKEND_URL}${environment.SEND_WELCOME_MAIL_URL}`,
      { Mail: 'max@example.de', Name: 'max' },
    );
  });

  it('should return undefined and show an error toast when createNotification returns no record', async () => {
    mockInsertNotificationGQL.mutate.mockReturnValue(
      of({ data: { insert_Notification: { returning: [] } } }),
    );

    await expect(firstValueFrom(service.createNotification({ Subject: 'Subject' }))).resolves.toBeUndefined();
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Error creating notification. Please try again.',
      ToastType.Error,
    );
  });

  it('should return undefined and show an error toast when createNotification fails', async () => {
    mockInsertNotificationGQL.mutate.mockReturnValue(
      throwError(() => new Error('insert failed')),
    );

    await expect(firstValueFrom(service.createNotification({ Subject: 'Subject' }))).resolves.toBeUndefined();
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Oh nein! Das hat leider nicht geklappt!',
      ToastType.Error,
    );
  });

  it('should update a notification and map the response', async () => {
    mockUpdateNotificationGQL.mutate.mockReturnValue(
      of({
        data: {
          update_Notification_by_pk: {
            Id: 'n-1',
            Subject: 'Updated',
            Content: 'Body',
            DueDate: '2026-08-08',
            CreatedAt: '2026-08-06',
            Mail: 'max@example.de',
            IsDraft: true,
            IsArchived: false,
          },
        },
      }),
    );

    await expect(
      firstValueFrom(
        service.updateNotification({
          id: 'n-1',
          subject: 'Updated',
          content: 'Body',
          dueDate: '2026-08-08',
          createdAt: '2026-08-06',
          mail: 'max@example.de',
          isDraft: true,
          isArchived: false,
        }),
      ),
    ).resolves.toEqual({
      id: 'n-1',
      subject: 'Updated',
      content: 'Body',
      dueDate: '2026-08-08',
      createdAt: '2026-08-06',
      mail: 'max@example.de',
      isDraft: true,
      isArchived: false,
    });
    expect(mockUpdateNotificationGQL.mutate).toHaveBeenCalledWith({
      variables: {
        id: 'n-1',
        object: {
          Subject: 'Updated',
          Content: 'Body',
          DueDate: '2026-08-08',
          IsDraft: true,
          IsArchived: false,
          Mail: 'max@example.de',
        },
      },
    });
  });

  it('should return undefined and show an error toast when updateNotification returns no record', async () => {
    mockUpdateNotificationGQL.mutate.mockReturnValue(
      of({ data: { update_Notification_by_pk: null } }),
    );

    await expect(
      firstValueFrom(
        service.updateNotification({
          id: 'n-1',
          subject: 'Updated',
          content: 'Body',
          dueDate: '2026-08-08',
          createdAt: '2026-08-06',
          mail: 'max@example.de',
          isDraft: true,
          isArchived: false,
        }),
      ),
    ).resolves.toBeUndefined();
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Error updating notification. Please try again.',
      ToastType.Error,
    );
  });

  it('should return undefined when updateNotification fails', async () => {
    mockUpdateNotificationGQL.mutate.mockReturnValue(
      throwError(() => new Error('update failed')),
    );

    await expect(
      firstValueFrom(
        service.updateNotification({
          id: 'n-1',
          subject: 'Updated',
          content: 'Body',
          dueDate: '2026-08-08',
          createdAt: '2026-08-06',
          mail: 'max@example.de',
          isDraft: true,
          isArchived: false,
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('should return an empty list when loadNotifications is called without a user id', async () => {
    await expect(firstValueFrom(service.loadNotifications(undefined))).resolves.toEqual([]);
    expect(mockGetNotificationByUserIdGQL.fetch).not.toHaveBeenCalled();
  });

  it('should load and map notifications for a user', async () => {
    mockGetNotificationByUserIdGQL.fetch.mockReturnValue(
      of({
        data: {
          Notification: [{
            Id: 'n-1',
            Subject: 'Subject',
            Content: 'Body',
            DueDate: '2026-08-07',
            CreatedAt: '2026-08-06',
            Mail: 'max@example.de',
            IsDraft: false,
            IsArchived: true,
          }],
        },
      }),
    );

    await expect(firstValueFrom(service.loadNotifications('u-1'))).resolves.toEqual([
      {
        id: 'n-1',
        subject: 'Subject',
        content: 'Body',
        dueDate: '2026-08-07',
        createdAt: '2026-08-06',
        mail: 'max@example.de',
        isDraft: false,
        isArchived: true,
      },
    ]);
  });

  it('should return an empty list when loading notifications fails', async () => {
    mockGetNotificationByUserIdGQL.fetch.mockReturnValue(
      throwError(() => new Error('load failed')),
    );

    await expect(firstValueFrom(service.loadNotifications('u-1'))).resolves.toEqual([]);
  });

  it('should return whether a single notification was deleted', async () => {
    mockDeleteNotificationByIdGQL.mutate.mockReturnValue(
      of({ data: { delete_Notification_by_pk: { Id: 'n-1' } } }),
    );

    await expect(firstValueFrom(service.deleteNotification('n-1'))).resolves.toBe(true);
  });

  it('should return false when deleteNotification returns no record', async () => {
    mockDeleteNotificationByIdGQL.mutate.mockReturnValue(
      of({ data: { delete_Notification_by_pk: null } }),
    );

    await expect(firstValueFrom(service.deleteNotification('n-1'))).resolves.toBe(false);
  });

  it('should return false when deleting a notification fails', async () => {
    mockDeleteNotificationByIdGQL.mutate.mockReturnValue(
      throwError(() => new Error('delete failed')),
    );

    await expect(firstValueFrom(service.deleteNotification('n-1'))).resolves.toBe(false);
  });

  it('should return whether archived notifications were deleted', async () => {
    mockDeleteNotificationsByUserIdGQL.mutate.mockReturnValue(
      of({ data: { delete_Notification: { affected_rows: 2 } } }),
    );

    await expect(firstValueFrom(service.deleteAllNotificationsByUserId('u-1'))).resolves.toBe(true);
  });

  it('should return false when deleteAllNotificationsByUserId returns no result', async () => {
    mockDeleteNotificationsByUserIdGQL.mutate.mockReturnValue(
      of({ data: { delete_Notification: null } }),
    );

    await expect(firstValueFrom(service.deleteAllNotificationsByUserId('u-1'))).resolves.toBe(false);
  });

  it('should return false when deleteAllNotificationsByUserId fails', async () => {
    mockDeleteNotificationsByUserIdGQL.mutate.mockReturnValue(
      throwError(() => new Error('bulk delete failed')),
    );

    await expect(firstValueFrom(service.deleteAllNotificationsByUserId('u-1'))).resolves.toBe(false);
  });
});