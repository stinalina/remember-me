import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { firstValueFrom, of } from 'rxjs';

import { authHasuraInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authHasuraInterceptor', () => {
  let mockAuthService: { getIdToken: ReturnType<typeof vi.fn> };
  let originalAdminSecret: unknown;

  beforeEach(() => {
    originalAdminSecret = environment.HASURA_ADMIN_SECRET;
    mockAuthService = {
      getIdToken: vi.fn().mockReturnValue(of('token-123')),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
  });

  afterEach(() => {
    Object.defineProperty(environment, 'HASURA_ADMIN_SECRET', {
      configurable: true,
      writable: true,
      value: originalAdminSecret,
    });
  });

  it('should pass through non-hasura requests unchanged', async () => {
    const request = new HttpRequest('GET', 'https://example.org/api');
    let receivedRequest: HttpRequest<unknown> | undefined;

    await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        authHasuraInterceptor(request, (nextRequest) => {
          receivedRequest = nextRequest;
          return of(new HttpResponse({ status: 200 }));
        }),
      ),
    );

    expect(receivedRequest).toBe(request);
    expect(mockAuthService.getIdToken).not.toHaveBeenCalled();
  });

  it('should attach the admin secret for hasura requests when configured', async () => {
    Object.defineProperty(environment, 'HASURA_ADMIN_SECRET', {
      configurable: true,
      writable: true,
      value: 'secret-123',
    });
    const request = new HttpRequest('GET', `${environment.HASURA_URL}/v1/graphql`);
    let receivedRequest: HttpRequest<unknown> | undefined;

    await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        authHasuraInterceptor(request, (nextRequest) => {
          receivedRequest = nextRequest;
          return of(new HttpResponse({ status: 200 }));
        }),
      ),
    );

    expect(receivedRequest?.headers.get('x-hasura-admin-secret')).toBe('secret-123');
    expect(mockAuthService.getIdToken).not.toHaveBeenCalled();
  });

  it('should attach a bearer token for hasura requests when no admin secret is configured', async () => {
    Object.defineProperty(environment, 'HASURA_ADMIN_SECRET', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    const request = new HttpRequest('GET', `${environment.HASURA_URL}/v1/graphql`);
    let receivedRequest: HttpRequest<unknown> | undefined;

    await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        authHasuraInterceptor(request, (nextRequest) => {
          receivedRequest = nextRequest;
          return of(new HttpResponse({ status: 200 }));
        }),
      ),
    );

    expect(mockAuthService.getIdToken).toHaveBeenCalled();
    expect(receivedRequest?.headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('should forward the original request when no token is available', async () => {
    Object.defineProperty(environment, 'HASURA_ADMIN_SECRET', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    mockAuthService.getIdToken.mockReturnValue(of(undefined));
    const request = new HttpRequest('GET', `${environment.HASURA_URL}/v1/graphql`);
    let receivedRequest: HttpRequest<unknown> | undefined;

    await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        authHasuraInterceptor(request, (nextRequest) => {
          receivedRequest = nextRequest;
          return of(new HttpResponse({ status: 200 }));
        }),
      ),
    );

    expect(receivedRequest).toBe(request);
  });
});