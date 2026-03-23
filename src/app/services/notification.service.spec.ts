import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetUserByMailGQL, InsertNotificationGQL, InsertUserGQL } from '@hasura/generated';
import { INotification, IUser } from '@shared/models';
import { NotificationService } from './notification.service';

describe('NotificationService getUserByMailOrCreateUserIfNotExists', () => {
  let service: NotificationService;

  let mockGetUserByMailGQL: jasmine.SpyObj<GetUserByMailGQL>;
  let mockInsertUserGQL: jasmine.SpyObj<InsertUserGQL>;
  let mockInsertNotificationGQL: jasmine.SpyObj<InsertNotificationGQL>;
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
      of({data: {User: []}})
    );

    mockInsertUserGQL = jasmine.createSpyObj(['mutate']);
    mockInsertUserGQL.mutate.and.returnValue(
      of({data: {insert_User: {returning: [{Name: 'Heinz', Id: 'def-456'}]}}})
    );

    mockInsertNotificationGQL = jasmine.createSpyObj(['mutate']);
    mockInsertNotificationGQL.mutate.and.returnValue(of({data: {}}));

    httpMock = jasmine.createSpyObj(['post']);
    httpMock.post.and.returnValue(of({}));

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
      of({data: {User: [{Name: 'Horst', Id: 'abc-123'}]}})
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