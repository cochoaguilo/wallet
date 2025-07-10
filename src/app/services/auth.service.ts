import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/usuarios/';
  constructor(private http: HttpClient) {}

  register(body: User): Observable<any> {
    return this.http.post<any>(this.baseUrl + "sign-in",body)
  }

  login(body: User): Observable<any> {
    return this.http.post<any>(this.baseUrl + "log-in",body)
  }
}
