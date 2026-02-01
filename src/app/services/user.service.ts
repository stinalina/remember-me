import { inject, Injectable, signal } from "@angular/core";
import { IUser } from "../shared/models";
import { LocalStorageService } from "./local-storage.service";

@Injectable({ providedIn: 'root' })
export class UserService {
  public readonly currUser = signal<IUser | null>(null);
  public readonly freeNotificationsLimit = signal<number>(3);

  private readonly localStorage = inject(LocalStorageService);
}