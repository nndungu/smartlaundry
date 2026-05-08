import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { User } from '../../models/auth/user.model';
import { AuthResponse } from '../../models/auth/auth-response.model';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { APP_CONSTANTS } from '../../core/constants/app-constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  private http = inject(HttpClient);

  constructor() {
    this.loadTokens();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, { email, password }).pipe(
      map(response => {
        this.setTokens(response.token, response.refreshToken, response.expiresIn);
        this.setCurrentUser(response.user);
        return response;
      })
    );
  }

  register(userData: { fullName: string; email: string; phone: string; passwordHash: string; role: { id: number }; isActive: boolean }): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, userData);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {}).pipe(
      map(() => {
        this.clearTokens();
      })
    );
  }

  refreshAccessToken(): Observable<AuthResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.http.post<AuthResponse>(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, { refreshToken: this.refreshToken }).pipe(
      map(response => {
        this.setTokens(response.token, response.refreshToken, response.expiresIn);
        this.setCurrentUser(response.user);
        return response;
      })
    );
  }

  getToken(): string | null {
    if (this.isTokenExpired()) {
      this.clearTokens();
      return null;
    }
    return this.accessToken;
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map(user => !!user));
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem(APP_CONSTANTS.USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(APP_CONSTANTS.USER_KEY);
    }
  }

  private setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, accessToken);
    localStorage.setItem(APP_CONSTANTS.REFRESH_TOKEN_KEY, refreshToken);
  }

  private loadTokens(): void {
    this.refreshToken = localStorage.getItem(APP_CONSTANTS.REFRESH_TOKEN_KEY);
    this.accessToken = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);

    // Restore user from localStorage
    const savedUser = localStorage.getItem(APP_CONSTANTS.USER_KEY);
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(APP_CONSTANTS.USER_KEY);
      }
    }
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.REFRESH_TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.USER_KEY);
    this.currentUserSubject.next(null);
  }

  private isTokenExpired(): boolean {
    return this.tokenExpiry ? Date.now() > this.tokenExpiry : true;
  }

  sendPasswordResetEmail(email: string): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, { email });
  }
}