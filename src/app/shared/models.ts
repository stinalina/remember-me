export interface INotification {
  subject: string;
  content: string;
  dueDate: string;
  mail: string;
}

export interface IUser {
  mail: string;
  name: string;
}
//export type RememberMeNotificationWithoutMail = Omit<RememberMeNotification, 'mail'>;