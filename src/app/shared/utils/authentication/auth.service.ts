import { inject, Injectable, signal } from '@angular/core';
import { Auth, browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, deleteUser, sendPasswordResetEmail, setPersistence, signInAnonymously, signInWithEmailAndPassword, signOut, updatePassword as firebaseUpdatePassword } from '@angular/fire/auth';
import { LocalStorageService } from '@services/local-storage.service';
import { ToastService, ToastType } from '@services/toast.service';
import { EmailAuthProvider, User, UserCredential, reauthenticateWithCredential } from 'firebase/auth';
import { catchError, EMPTY, from, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly fireAuth: Auth = inject(Auth);
  private readonly toastService = inject(ToastService);
  private readonly localStorage = inject(LocalStorageService);

  public readonly currentUser = signal<User | null>(this.fireAuth.currentUser);
  public readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    this.fireAuth.onAuthStateChanged(user => {
      if (user === null) {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        signInAnonymously(this.fireAuth);
        return;
      }
      this.isAuthenticated.set(!user.isAnonymous);
      this.currentUser.set(user);
    });
  }

  public signUp(email: string, password: string): Observable<UserCredential | null> {
    return from(createUserWithEmailAndPassword(this.fireAuth, email, password)).pipe(
      switchMap((credential) => from(credential.user.getIdToken(true)).pipe(map(() => credential))),
      tap((credential) => {
        this.currentUser.set(credential.user);
        this.isAuthenticated.set(true);
        this.localStorage.setUserMail(email);
      }),
      catchError(error => {
        this.handleError(error);
        return of(null); 
      })
    );
  }

  public signIn(email: string, password: string, rememberMe: boolean): Observable<boolean> {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    return from(setPersistence(this.fireAuth, persistence)).pipe(
      switchMap(() => signInWithEmailAndPassword(this.fireAuth, email, password)),
      switchMap((credential) => from(credential.user.getIdToken(true)).pipe(map(() => credential))),
      tap((credential) => {
        this.currentUser.set(credential.user);
        this.isAuthenticated.set(true);
        this.localStorage.setUserMail(email);
      }),
      map(() => true),
      catchError(error => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  public signOut(): Observable<void> {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    return from(signOut(this.fireAuth)).pipe(
      catchError(error => {
        this.handleError(error);
        return EMPTY; 
      })
    );
  }

  public resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.fireAuth, email)).pipe(
      catchError(error => {
        this.handleError(error);
        return EMPTY; 
      })
    );
  }

  public deleteAccount(currentPassword: string): Observable<void> {
    const user = this.fireAuth.currentUser;
    if (!user) return EMPTY;

    return this.reauthenticate(currentPassword).pipe(
      switchMap(() => from(deleteUser(user))),
      tap(() => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }),
      catchError(error => {
        this.handleError(error);
        return EMPTY;
      })
    );
  }

  public reauthenticate(currentPassword: string): Observable<void> {
    const user = this.fireAuth.currentUser;
    if (!user || !user.email) {
      return EMPTY;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return from(reauthenticateWithCredential(user, credential)).pipe(map(() => void 0));
  }

  public updatePassword(newPassword: string, currentPassword: string): Observable<void> {
    const user = this.fireAuth.currentUser;
    if (!user) return EMPTY;
    return this.reauthenticate(currentPassword).pipe(
      switchMap(() => from(firebaseUpdatePassword(user, newPassword))),
      catchError(error => {
        this.handleError(error);
        return EMPTY;
      })
    );
  }

  public getIdToken(): Observable<string | undefined> {
    const currentUser = this.fireAuth.currentUser;
    if (currentUser) {
      return from(currentUser.getIdToken());
    } else {
      console.error('This should never happen. At least an anonymous user should be signed in.')
      return of(undefined);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error: any): void {
    let errorMessage: string;
    switch (error.code) {
      case 'auth/invalid-credential':
        errorMessage = 'Ungültige Anmeldedaten. Bitte überprüfe deine E-Mail-Adresse und dein Passwort.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Kein Benutzer mit dieser E-Mail-Adresse gefunden.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Falsches Passwort. Bitte versuche es erneut.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Passwort ist zu schwach.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Die E-Mail-Adresse wird bereits verwendet.';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Bitte melde dich erneut mit deinem aktuellen Passwort an, um diese Aktion auszuführen.';
        break;
      default:
        errorMessage = 'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut.';
    }

    console.error('Authentication error:', error);
    this.toastService.showToast(errorMessage, ToastType.Error);
  }
}