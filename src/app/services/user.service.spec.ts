import { TestBed } from "@angular/core/testing";
import { UserService } from "./user.service";

describe('Local Stoarge Service', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
  });
});