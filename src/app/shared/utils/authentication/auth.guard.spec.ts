import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let mockAuth: { authStateReady: ReturnType<typeof vi.fn> };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };
  let mockAuthService: { isAuthenticated: ReturnType<typeof vi.fn> };

  const runGuard = () => TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

  beforeEach(() => {
    mockAuth = {
      authStateReady: vi.fn().mockResolvedValue(undefined),
    };
    mockRouter = {
      createUrlTree: vi.fn().mockReturnValue({ redirectedTo: ROUTER_TOKENS.LOGIN }),
    };
    mockAuthService = {
      isAuthenticated: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  it('should allow authenticated users', async () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    await expect(runGuard()).resolves.toBe(true);
    expect(mockAuth.authStateReady).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect unauthenticated users to login', async () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);

    await expect(runGuard()).resolves.toEqual({ redirectedTo: ROUTER_TOKENS.LOGIN });
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([ROUTER_TOKENS.LOGIN]);
  });
});