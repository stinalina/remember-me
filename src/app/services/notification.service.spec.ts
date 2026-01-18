// import { TestBed } from '@angular/core/testing';
// import { NotificationService } from './notification.service';
// import { GetUserByMailGQL, InsertNotificationGQL, InsertUserGQL } from '../../../graphql/generated';
// import { of } from 'rxjs';
// import { IUser } from '../models';
// import { provideHttpClientTesting } from '@angular/common/http/testing';

// describe('NotificationService getUserByMailOrCreateUserIfNotExists', () => {
//    let service: NotificationService;
//   let mockGetUserByMailGQL: jest.Mocked<GetUserByMailGQL>;
//   let mockInsertUserGQL: jest.Mocked<InsertUserGQL>;
//   let mockInsertNotificationGQL: jest.Mocked<InsertNotificationGQL>;

//   beforeEach(() => {
//     // Create mock objects for the GraphQL services
//     mockGetUserByMailGQL = {
//       fetch: jest.fn()
//     } as unknown as jest.Mocked<GetUserByMailGQL>;
//     mockInsertUserGQL = {
//       mutate: jest.fn()
//     } as unknown as jest.Mocked<InsertUserGQL>;
//     mockInsertNotificationGQL = {
//       mutate: jest.fn()
//     } as unknown as jest.Mocked<InsertNotificationGQL>;

//     TestBed.configureTestingModule({
//       providers: [
//         provideHttpClientTesting(),
//         NotificationService,
//         { provide: GetUserByMailGQL, useValue: mockGetUserByMailGQL },
//         { provide: InsertUserGQL, useValue: mockInsertUserGQL },
//         { provide: InsertNotificationGQL, useValue: mockInsertNotificationGQL }
//       ]
//     });

//     service = TestBed.inject(NotificationService);
//   });

//   it('should create a new user if user does not exist', (done) => {
//       const testMail = 'test@example.com';
//       const newUserId = 'user-123';

//       // Mock: User doesn't exist
//       mockGetUserByMailGQL.fetch.mockReturnValue(
//         of({
//           data: {
//             dev_User: []
//           }
//         } as any)
//       );

//       // Mock: Insert user returns the new user with ID
//       mockInsertUserGQL.mutate.mockReturnValue(
//         of({
//           data: {
//             insert_dev_User: {
//               returning: [
//                 {
//                   Id: newUserId,
//                   Name: 'Unknown'
//                 }
//               ]
//             }
//           }
//         } as any)
//       );

//       service.getUserByMailOrCreateUserIfNotExists(testMail).subscribe((result: IUser) => {
//         expect(mockGetUserByMailGQL.fetch).toHaveBeenCalledWith({
//           variables: { mail: testMail }
//         });
//         expect(mockInsertUserGQL.mutate).toHaveBeenCalledWith({
//           variables: {
//             mail: testMail,
//             name: 'Unknown'
//           }
//         });
//         expect(result.userId).toBe(newUserId);
//         done();
//       });
//     });

//   it('should return existing user if user exists', (done) => {
//     const testMail = 'existing@example.com';
//     const existingUserId = 'user-456';
//     const existingUserName = 'John Doe';

//     // Mock: User exists
//     mockGetUserByMailGQL.fetch.mockReturnValue(
//       of({
//         data: {
//           dev_User: [
//             {
//               Id: existingUserId,
//               Name: existingUserName
//             }
//           ]
//         }
//       } as any)
//     );

//     service.getUserByMailOrCreateUserIfNotExists(testMail).subscribe((result: IUser) => {
//       expect(mockGetUserByMailGQL.fetch).toHaveBeenCalledWith({
//         variables: { mail: testMail }
//       });
//       expect(mockInsertUserGQL.mutate).not.toHaveBeenCalled();
//       expect(result.mail).toBe(testMail);
//       expect(result.userId).toBe(existingUserId);
//       expect(result.name).toBe(existingUserName);
//       done();
//     });
//   });

//   it('should handle existing user with null name and return empty string', (done) => {
//     const testMail = 'nullname@example.com';
//     const existingUserId = 'user-789';

//     // Mock: User exists but name is null
//     mockGetUserByMailGQL.fetch.mockReturnValue(
//       of({
//         data: {
//           dev_User: [
//             {
//               Id: existingUserId,
//               Name: null
//             }
//           ]
//         }
//       } as any)
//     );

//     service.getUserByMailOrCreateUserIfNotExists(testMail).subscribe((result: IUser) => {
//       expect(result.name).toBe('');
//       expect(result.userId).toBe(existingUserId);
//       done();
//     });
//   });

//   it('should handle error during user fetch and create new user', (done) => {
//     const testMail = 'error@example.com';
//     const newUserId = 'user-error-123';

//     // Mock: First fetch returns empty array (simulating error handling or no user found)
//     mockGetUserByMailGQL.fetch.mockReturnValue(
//       of({
//         data: {
//           dev_User: []
//         }
//       } as any)
//     );

//     // Mock: Insert user is successful
//     mockInsertUserGQL.mutate.mockReturnValue(
//       of({
//         data: {
//           insert_dev_User: {
//             returning: [
//               {
//                 Id: newUserId,
//                 Name: 'Unknown'
//               }
//             ]
//           }
//         }
//       } as any)
//     );

//     service.getUserByMailOrCreateUserIfNotExists(testMail).subscribe((result: IUser) => {
//       expect(mockInsertUserGQL.mutate).toHaveBeenCalled();
//       expect(result.userId).toBe(newUserId);
//       done();
//     });
//   });

//   it('should handle new user with undefined returning data gracefully', (done) => {
//     const testMail = 'edge@example.com';

//     // Mock: User doesn't exist
//     mockGetUserByMailGQL.fetch.mockReturnValue(
//       of({
//         data: {
//           dev_User: []
//         }
//       } as any)
//     );

//     // Mock: Insert returns minimal data
//     mockInsertUserGQL.mutate.mockReturnValue(
//       of({
//         data: {
//           insert_dev_User: {
//             returning: [
//               {
//                 Id: undefined,
//                 Name: 'Unknown'
//               }
//             ]
//           }
//         }
//       } as any)
//     );

//     service.getUserByMailOrCreateUserIfNotExists(testMail).subscribe((result: IUser) => {
//       expect(mockInsertUserGQL.mutate).toHaveBeenCalled();
//       done();
//     });
//   });

//   it('should call getUserByMail with correct mail parameter', (done) => {
//     const testMail = 'param@example.com';

//     // Mock: User doesn't exist
//     mockGetUserByMailGQL.fetch.mockReturnValue(
//       of({
//         data: {
//           dev_User: []
//         }
//       } as any)
//     );

//     // Mock: Insert user
//     mockInsertUserGQL.mutate.mockReturnValue(
//       of({
//         data: {
//           insert_dev_User: {
//             returning: [{ Id: 'user-123', Name: 'Unknown' }]
//           }
//         }
//       } as any)
//     );

//     service.getUserByMailOrCreateUserIfNotExists(testMail).subscribe(() => {
//       expect(mockGetUserByMailGQL.fetch).toHaveBeenCalledWith({
//         variables: { mail: testMail }
//       });
//       done();
//     });
//   });
// });
