import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegistroRequest } from '../models/auth.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = 'https://cafebackend-production-14cb.up.railway.app/api/auth' //'http://localhost:8080/api/auth';
  private _usuario = signal<LoginResponse | null>(null);
  readonly usuario = this._usuario.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    this.cargarSesion(); 
  }

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.url}/login`, request).pipe(
      tap(response => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth', JSON.stringify(response));
        }
        this._usuario.set(response);
      })
    );
  }

  registro(request: RegistroRequest) {
    return this.http.post(`${this.url}/registro`, request);
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth');
    }
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this._usuario()?.rol === 'ADMIN';
  }

  isUser(): boolean {
    return this._usuario()?.rol === 'USER';
  }

  isLoggedIn(): boolean {
    return this._usuario() !== null;
  }

  private cargarSesion(): void {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('auth');
      if (data) {
        try {
          const parsed = JSON.parse(data) as LoginResponse;
          this._usuario.set(parsed);
        } catch (e) {
          localStorage.removeItem('auth');
        }
      }
    }
  }
}