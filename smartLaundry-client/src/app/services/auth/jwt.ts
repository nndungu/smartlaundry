import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../core/constants/app-constants';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): string | null {
    return localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(APP_CONSTANTS.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(APP_CONSTANTS.REFRESH_TOKEN_KEY, refreshToken);
  }

  removeTokens(): void {
    localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.REFRESH_TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.USER_KEY);
  }

  isTokenExpired(token?: string | null): boolean {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;

    try {
      const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  getTokenPayload(token?: string | null): any {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return null;

    try {
      return JSON.parse(atob(tokenToCheck.split('.')[1]));
    } catch {
      return null;
    }
  }
}