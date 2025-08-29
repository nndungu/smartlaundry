import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { RegisterRequest } from '../../models/auth/register-request.model';
import { AuthResponse, RegisterResponse } from '../../models/auth/auth-response.model';
import { User } from '../../models/auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    // Mock registration for demo
    return of({
      user: {
        id: '1',
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        role: registerData.role,
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: 'demo_token_' + Date.now(),
      refreshToken: 'demo_refresh_' + Date.now(),
      expiresIn: 3600,
      message: 'Registration successful'
    });
  }

  isAuthenticated(): boolean {
    return false; // Simplified for now
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}