import { inject, Injectable, signal } from '@angular/core';
import { Auth, browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, setPersistence, signInAnonymously, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { LocalStorageService } from '@app/services/local-storage.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { User, UserCredential } from 'firebase/auth';
import { catchError, EMPTY, from, map, Observable, of, switchMap, tap } from "rxjs";

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
        signInAnonymously(this.fireAuth);
        return;
      }
      this.isAuthenticated.set(!user.isAnonymous);
      this.currentUser.set(user);
    });
  }

  public signUp(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.fireAuth, email, password)).pipe(
      tap(() => this.localStorage.setUserMail(email)),
      catchError(error => {
        this.handleError(error);
        return EMPTY; 
      })
    );
  }

  public signIn(email: string, password: string, rememberMe: boolean): Observable<void> {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    return from(setPersistence(this.fireAuth, persistence)).pipe(
    switchMap(() => signInWithEmailAndPassword(this.fireAuth, email, password)),
    tap(() => this.localStorage.setUserMail(email)),
    catchError(error => {
      this.handleError(error);
      return EMPTY; 
    }),
    map(() => void 0)
  );
  }

  public signOut(): Observable<void> {
    return from(signOut(this.fireAuth)).pipe(
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
      default:
        errorMessage = 'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut.';
    }

    console.error('Authentication error:', error);
    this.toastService.showToast(errorMessage, ToastType.Error);
  }
}