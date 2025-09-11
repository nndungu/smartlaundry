import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, map, from } from 'rxjs';
import { User } from '../../models/auth/user.model';

import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private auth = inject(Auth);

  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<User | null> {
    return authState(this.auth).pipe(
      map(firebaseUser => {
        if (firebaseUser) {
          return {
            id: firebaseUser.uid,
            email: firebaseUser.email,
          } as User;
        }
        return null;
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return authState(this.auth).pipe(
      map(user => !!user)
    );
  }

  sendPasswordResetEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }
}
