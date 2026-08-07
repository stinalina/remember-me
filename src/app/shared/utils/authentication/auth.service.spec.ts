import { TestBed } from '@angular/core/testing';
import {
  Auth,
  browserLocalPersistence,
  browserSessionPersistence,
} from '@angular/fire/auth';
import type { User } from 'firebase/auth';
import { LocalStorageService } from '@services/local-storage.service';
import { ToastService, ToastType } from '@services/toast.service';
import { defaultIfEmpty, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

const angularFireAuthFns = vi.hoisted(() => ({
  createUserWithEmailAndPassword: vi.fn(),
  deleteUser: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  setPersistence: vi.fn(),
  signInAnonymously: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updatePassword: vi.fn(),
}));

const firebaseAuthFns = vi.hoisted(() => ({
  credential: vi.fn(),
  reauthenticateWithCredential: vi.fn(),
}));

vi.mock('@angular/fire/auth', () => ({
  Auth: class {},
  browserLocalPersistence: 'local-persistence',
  browserSessionPersistence: 'session-persistence',
  createUserWithEmailAndPassword: angularFireAuthFns.createUserWithEmailAndPassword,
  deleteUser: angularFireAuthFns.deleteUser,
  sendPasswordResetEmail: angularFireAuthFns.sendPasswordResetEmail,
  setPersistence: angularFireAuthFns.setPersistence,
  signInAnonymously: angularFireAuthFns.signInAnonymously,
  signInWithEmailAndPassword: angularFireAuthFns.signInWithEmailAndPassword,
  signOut: angularFireAuthFns.signOut,
  updatePassword: angularFireAuthFns.updatePassword,
}));

vi.mock('firebase/auth', () => ({
  EmailAuthProvider: {
    credential: firebaseAuthFns.credential,
  },
  reauthenticateWithCredential: firebaseAuthFns.reauthenticateWithCredential,
}));

describe('AuthService', () => {
  let service: AuthService;
  let authStateChangedHandler: ((user: User | null) => void) | undefined;
  let mockAuth: {
    currentUser: User | null;
    onAuthStateChanged: ReturnType<typeof vi.fn>;
  };
  let mockLocalStorage: { setUserMail: ReturnType<typeof vi.fn> };
  let mockToastService: { showToast: ReturnType<typeof vi.fn> };

  type MockUserOverrides = Partial<Pick<User,
    'email' |
    'isAnonymous' |
    'getIdToken'
  >>;

  const createUser = (overrides: MockUserOverrides = {}): User => ({
    email: 'max@example.de',
    isAnonymous: false,
    getIdToken: vi.fn().mockResolvedValue('token-123'),
    ...overrides,
  } as unknown as User);

  beforeEach(() => {
    authStateChangedHandler = undefined;
    mockAuth = {
      currentUser: null,
      onAuthStateChanged: vi.fn((handler: (user: User | null) => void) => {
        authStateChangedHandler = handler;
      }),
    };
    mockLocalStorage = {
      setUserMail: vi.fn(),
    };
    mockToastService = {
      showToast: vi.fn(),
    };

    angularFireAuthFns.createUserWithEmailAndPassword.mockReset();
    angularFireAuthFns.deleteUser.mockReset();
    angularFireAuthFns.sendPasswordResetEmail.mockReset();
    angularFireAuthFns.setPersistence.mockReset();
    angularFireAuthFns.signInAnonymously.mockReset();
    angularFireAuthFns.signInWithEmailAndPassword.mockReset();
    angularFireAuthFns.signOut.mockReset();
    angularFireAuthFns.updatePassword.mockReset();
    firebaseAuthFns.credential.mockReset();
    firebaseAuthFns.reauthenticateWithCredential.mockReset();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth },
        { provide: LocalStorageService, useValue: mockLocalStorage },
        { provide: ToastService, useValue: mockToastService },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should sign in anonymously when auth state becomes null', () => {
    authStateChangedHandler?.(null);

    expect(angularFireAuthFns.signInAnonymously).toHaveBeenCalledWith(mockAuth);
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should set the authenticated user state when auth state changes to a real user', () => {
    const user = createUser();
    authStateChangedHandler?.(user);

    expect(service.currentUser()).toBe(user);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should keep isAuthenticated false for anonymous users', () => { //anonyme user werden explizit für hasura abfragen benötigt
    const user = createUser({ isAnonymous: true });
    authStateChangedHandler?.(user);

    expect(service.currentUser()).toBe(user);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should sign up successfully and persist the user mail', async () => {
    const user = createUser();
    angularFireAuthFns.createUserWithEmailAndPassword.mockResolvedValue({ user });

    await expect(firstValueFrom(service.signUp('max@example.de', 'secret'))).resolves.toEqual({ user });
    expect(service.currentUser()).toBe(user);
    expect(service.isAuthenticated()).toBe(true);
    expect(mockLocalStorage.setUserMail).toHaveBeenCalledWith('max@example.de');
  });

  it('should return null and show a toast when sign up fails', async () => {
    angularFireAuthFns.createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/email-already-in-use',
    });

    await expect(firstValueFrom(service.signUp('max@example.de', 'secret'))).resolves.toBeNull();
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Die E-Mail-Adresse wird bereits verwendet.',
      ToastType.Error,
    );
  });

  it('should sign in with the selected persistence and return true on success', async () => {
    const user = createUser();
    angularFireAuthFns.setPersistence.mockResolvedValue(undefined);
    angularFireAuthFns.signInWithEmailAndPassword.mockResolvedValue({ user });

    await expect(firstValueFrom(service.signIn('max@example.de', 'secret', true))).resolves.toBe(true);
    expect(angularFireAuthFns.setPersistence).toHaveBeenCalledWith(mockAuth, browserLocalPersistence);
    expect(mockLocalStorage.setUserMail).toHaveBeenCalledWith('max@example.de');
  });

  it('should return false and show a toast when sign in fails', async () => {
    angularFireAuthFns.setPersistence.mockResolvedValue(undefined);
    angularFireAuthFns.signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });

    await expect(firstValueFrom(service.signIn('max@example.de', 'bad-secret', false))).resolves.toBe(false);
    expect(angularFireAuthFns.setPersistence).toHaveBeenCalledWith(mockAuth, browserSessionPersistence);
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Falsches Passwort. Bitte versuche es erneut.',
      ToastType.Error,
    );
  });

  it('should complete silently when reset password fails', async () => {
    angularFireAuthFns.sendPasswordResetEmail.mockRejectedValue({ code: 'auth/user-not-found' });

    await expect(
      firstValueFrom(service.resetPassword('unknown@example.de').pipe(defaultIfEmpty('completed'))),
    ).resolves.toBe('completed');
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Kein Benutzer mit dieser E-Mail-Adresse gefunden.',
      ToastType.Error,
    );
  });

  it('should sign out and clear the auth state', async () => {
    const user = createUser();
    service.currentUser.set(user);
    service.isAuthenticated.set(true);
    angularFireAuthFns.signOut.mockResolvedValue(undefined);

    await expect(firstValueFrom(service.signOut())).resolves.toBeUndefined();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should reauthenticate with the current email and password', async () => {
    const user = createUser();
    mockAuth.currentUser = user;
    firebaseAuthFns.credential.mockReturnValue({ provider: 'password' });
    firebaseAuthFns.reauthenticateWithCredential.mockResolvedValue(undefined);

    await expect(firstValueFrom(service.reauthenticate('secret'))).resolves.toBeUndefined();
    expect(firebaseAuthFns.credential).toHaveBeenCalledWith('max@example.de', 'secret');
    expect(firebaseAuthFns.reauthenticateWithCredential).toHaveBeenCalledWith(user, { provider: 'password' });
  });

  it('should return the current id token when a user exists', async () => {
    const user = createUser();
    mockAuth.currentUser = user;

    await expect(firstValueFrom(service.getIdToken())).resolves.toBe('token-123');
  });

  it('should return undefined when no current user exists', async () => {
    mockAuth.currentUser = null;

    await expect(firstValueFrom(service.getIdToken())).resolves.toBeUndefined();
  });
});