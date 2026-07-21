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
}
