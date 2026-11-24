import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login, User } from '../../interfaces/users.js';
import { HttpResponse } from 'src/interfaces/http-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/usuarios/`;
  private http = inject(HttpClient);
  constructor() {}

  register(body: User): Observable<HttpResponse<User>> {
    return this.http.post<HttpResponse<User>>(this.baseUrl + "sign-in", body)
  }

  login(body: User): Observable<HttpResponse<Login>> {
    return this.http.post<HttpResponse<Login>>(this.baseUrl + "log-in", body)
  }

  /**
   * Envía el ID token de Google al backend, que lo verifica, crea el usuario si no existe
   * y devuelve el mismo payload que `log-in`.
   */
  loginWithGoogle(credential: string): Observable<HttpResponse<Login>> {
    return this.http.post<HttpResponse<Login>>(this.baseUrl + "google", { credential })
  }

  /** Guarda en sesión el token y el usuario devueltos por el backend. */
  saveSession(data: Login): void {
    const expiresIn = data.expires_in || 200;
    const expTimestamp = Date.now() + expiresIn * 1000;
    sessionStorage.setItem("TOKEN_EXP", expTimestamp.toString());
    sessionStorage.setItem("USER", JSON.stringify(data.user));
    sessionStorage.setItem("TOKEN", data.access_token);
  }
}
