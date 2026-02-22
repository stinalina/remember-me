import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetUserByMail_DevGQL, InsertNotification_DevGQL, InsertUser_DevGQL } from '@hasura/generated';
import { INotification, IUser } from '@shared/models';
import { NotificationService } from './notification.service';

describe('NotificationService getUserByMailOrCreateUserIfNotExists', () => {
  let service: NotificationService;

  let mockGetUserByMailGQL: jasmine.SpyObj<GetUserByMail_DevGQL>;
  let mockInsertUserGQL: jasmine.SpyObj<InsertUser_DevGQL>;
  let mockInsertNotificationGQL: jasmine.SpyObj<InsertNotification_DevGQL>;
  let httpMock: jasmine.SpyObj<HttpClient>;

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
    mockGetUserByMailGQL = jasmine.createSpyObj(['fetch']);
    mockGetUserByMailGQL.fetch.and.returnValue(
      of({data: {dev_User: []}})
    );

    mockInsertUserGQL = jasmine.createSpyObj(['mutate']);
    mockInsertUserGQL.mutate.and.returnValue(
      of({data: {insert_dev_User: {returning: [{Name: 'Heinz', Id: 'def-456'}]}}})
    );

    mockInsertNotificationGQL = jasmine.createSpyObj(['mutate']);
    mockInsertNotificationGQL.mutate.and.returnValue(of({data: {}}));

    httpMock = jasmine.createSpyObj(['post']);
    httpMock.post.and.returnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: HttpClient, useValue: httpMock },
        { provide: GetUserByMail_DevGQL, useValue: mockGetUserByMailGQL },
        { provide: InsertUser_DevGQL, useValue: mockInsertUserGQL },
        { provide: InsertNotification_DevGQL, useValue: mockInsertNotificationGQL }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should create a new user if user does not exist', (done) => {
    service.getUserByMailOrCreateUserIfNotExists(mail).subscribe(
      (user) => {
        expect(mockInsertUserGQL.mutate).toHaveBeenCalled();
        expect(user.newCreated).toBeTrue();
        done();
      }
    );
  });

  it('should return existing user if user exists', (done) => {
    mockGetUserByMailGQL.fetch.and.returnValue(
      of({data: {dev_User: [{Name: 'Horst', Id: 'abc-123'}]}})
    );
    service.getUserByMailOrCreateUserIfNotExists(mail).subscribe(
      (user) => {
        expect(mockInsertUserGQL.mutate).not.toHaveBeenCalled();
        expect(user.newCreated).toBeFalse();
        done();
      }
    );
  });

  it('should create notification and send email', (done) => {
    service.createNotification(notification, user).subscribe(
      (result) => {
        expect(mockInsertNotificationGQL.mutate).toHaveBeenCalled();
        expect(httpMock.post).toHaveBeenCalled();
        expect(result).toBeTrue();
        done();
      }
    );
  });

  it('should return false when insert notification failed', (done) => {
    mockInsertNotificationGQL.mutate.and.returnValue(throwError(() => new Error('Insert failed')));
    service.createNotification(notification, user).subscribe(
      (result) => {
        expect(result).toBeFalse();
        done();
      }
    );
  });
});