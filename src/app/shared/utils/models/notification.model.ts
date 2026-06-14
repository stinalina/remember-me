export interface INotification {
  id: string;
  isDraft: boolean;
  isArchived: boolean;
  subject: string;
  mail: string;
  content: string;
  dueDate: string;
  createdAt: string;
}