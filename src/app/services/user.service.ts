import { Injectable, signal } from "@angular/core";
import { IUser } from "@shared/models";

@Injectable({ providedIn: 'root' })
export class UserService {
  public readonly currUser = signal<IUser | null>(null);
  public readonly freeNotificationsLimit = signal<number>(3);
}