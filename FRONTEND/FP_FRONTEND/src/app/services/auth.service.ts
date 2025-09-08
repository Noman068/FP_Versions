import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, AuthResponse, SignupRequest, SignupResponse } from '../models/auth.models';
import { AppStore, AuthActions } from '../store/app.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5268/api/auth';

  constructor(
    private http: HttpClient,
    private appStore: AppStore
  ) {}

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    this.appStore.dispatch(AuthActions.loginStart());
    
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.appStore.dispatch(AuthActions.loginSuccess(response));
        }),
        catchError(error => {
          this.appStore.dispatch(AuthActions.loginFailure(error.error?.message || 'Login failed'));
          return throwError(() => error);
        })
      );
  }

  signup(signupRequest: SignupRequest): Observable<SignupResponse> {
    this.appStore.dispatch(AuthActions.signupStart());
    
    return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, signupRequest)
      .pipe(
        tap(response => {
          if (response.success) {
            this.appStore.dispatch(AuthActions.signupSuccess(response));
          } else {
            this.appStore.dispatch(AuthActions.signupFailure(response.message || 'Signup failed'));
          }
        }),
        catchError(error => {
          this.appStore.dispatch(AuthActions.signupFailure(error.error?.message || 'Signup failed'));
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.appStore.dispatch(AuthActions.logout());
  }

  initializeAuth(): void {
    this.appStore.initializeAuth();
  }

  isAuthenticated(): boolean {
    return this.appStore.isAuthenticated;
  }

  getCurrentUser() {
    return this.appStore.currentUser;
  }

  getToken(): string | null {
    return this.appStore.currentToken;
  }
}
