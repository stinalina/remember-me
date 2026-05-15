import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { UserService } from '@app/services/user.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { defaultIfEmpty, firstValueFrom, from, isObservable, Observable, of, throwError } from 'rxjs';
import { MemberService } from './member.service';
import { memberResolver } from './member.resolver';

describe('memberResolver', () => {
  let mockAuth: { currentUser: { email?: string } | null };
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockUserService: {
    getUserByMailOrCreateUserIfNotExists: ReturnType<typeof vi.fn>;
    currUser: { set: ReturnType<typeof vi.fn> };
  };
  let mockMemberService: { loadMember: ReturnType<typeof vi.fn> };
  let mockToastService: { showToast: ReturnType<typeof vi.fn> };

  const runResolver = (): Observable<void | object> => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => memberResolver(route, state));

    if (isObservable(result)) {
      return result;
    }
    if (result instanceof Promise) {
      return from(result);
    }
    return of(result);
  };

  beforeEach(() => {
    mockAuth = { currentUser: null };
    mockRouter = { navigate: vi.fn() };
    mockUserService = {
      getUserByMailOrCreateUserIfNotExists: vi.fn(),
      currUser: { set: vi.fn() },
    };
    mockMemberService = { loadMember: vi.fn() };
    mockToastService = { showToast: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: MemberService, useValue: mockMemberService },
        { provide: ToastService, useValue: mockToastService },
      ],
    });
  });

  it('should redirect to login when no authenticated user email exists', async () => {
    await firstValueFrom(runResolver().pipe(defaultIfEmpty(undefined)));

    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_TOKENS.LOGIN]);
    expect(mockUserService.getUserByMailOrCreateUserIfNotExists).not.toHaveBeenCalled();
    expect(mockMemberService.loadMember).not.toHaveBeenCalled();
  });

  it('should resolve member when authenticated user email exists', async () => {
    mockAuth.currentUser = { email: 'test@example.de' };
    mockUserService.getUserByMailOrCreateUserIfNotExists.mockReturnValue(
      of({ userId: 'user-123' })
    );
    mockMemberService.loadMember.mockReturnValue(of(void 0));

    await firstValueFrom(runResolver().pipe(defaultIfEmpty(undefined)));

    expect(mockUserService.getUserByMailOrCreateUserIfNotExists).toHaveBeenCalledWith('test@example.de');
    expect(mockMemberService.loadMember).toHaveBeenCalledWith('user-123');
    expect(mockToastService.showToast).not.toHaveBeenCalled();
  });

  it('should show toast and redirect when loading user fails', async () => {
    mockAuth.currentUser = { email: 'test@example.de' };
    mockUserService.getUserByMailOrCreateUserIfNotExists.mockReturnValue(
      throwError(() => new Error('lookup failed'))
    );

    await firstValueFrom(runResolver().pipe(defaultIfEmpty(undefined)));

    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Fehler beim Laden der Benutzerdaten: lookup failed',
      ToastType.Error,
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_TOKENS.LOGIN]);
    expect(mockMemberService.loadMember).not.toHaveBeenCalled();
  });

  it('should show toast and redirect when loading member fails', async () => {
    mockAuth.currentUser = { email: 'test@example.de' };
    mockUserService.getUserByMailOrCreateUserIfNotExists.mockReturnValue(
      of({ userId: 'user-123' })
    );
    mockMemberService.loadMember.mockReturnValue(
      throwError(() => new Error('member failed'))
    );

    await firstValueFrom(runResolver().pipe(defaultIfEmpty(undefined)));

    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Fehler beim Laden des Users: member failed',
      ToastType.Error,
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_TOKENS.LOGIN]);
  });
});

