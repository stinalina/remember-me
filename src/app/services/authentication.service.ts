import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { User, UserCredential } from 'firebase/auth';
import { catchError, EMPTY, from, map, Observable, of } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthenticationService 
{
  private readonly fireAuth: Auth = inject(Auth);

  get currentUser(): User | undefined {
    return this.fireAuth.currentUser ?? undefined;
  }

  public isAuthenticated = signal<boolean>(false);

  public signUp(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.fireAuth, email, password)).pipe(
      catchError(error => {
        this.handleError(error);
        return EMPTY; 
      })
    );
  }

  public signIn(email: string, password: string): Observable<boolean> {
    let result = {success: true, message: ''};
    return from(signInWithEmailAndPassword(this.fireAuth, email, password)).pipe(
      map(() => {
        this.isAuthenticated.set(true);
        console.log(JSON.stringify(this.currentUser));
        return true;
      }),
      catchError(error => {
        result.success = false;
        result.message = this.handleError(error); //TODO just send toast msg
        return of(false);
      })
    );
  }

  public signOut(): Observable<void> {
    return from(signOut(this.fireAuth)).pipe(
      map(() => this.isAuthenticated.set(false))
    );
  }

  public getIdToken(): Observable<string | undefined> {
    const currentUser = this.fireAuth.currentUser;
    if (currentUser) {
      return from(currentUser.getIdToken());
    } else {
      return of(undefined);
    }
  }

  //  logout(){
  //   this.authenticationService.signOut().subscribe(() =>{
  //     this.#router.navigate([ROUTER_TOKENS.HOME]);
  //   });

  private handleError(error: any): string {
    let errorMessage = '';
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
      // Weitere Fehlercodes können hier behandelt werden
      default:
        errorMessage = 'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut.';
    }
    console.error('Authentication error:', error);
    return errorMessage;
  }
}