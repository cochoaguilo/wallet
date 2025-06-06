import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Savings } from 'src/interfaces/savings';

@Injectable({
  providedIn: 'root'
})
export class AhorrosService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/ahorros';

  public getAhorros(): Observable<Savings[]> {
    return this.http.get<Savings[]>(this.baseUrl);
  }

  public agregarAhorro(ahorro:Savings): Observable<Savings> {
    return this.http.post<Savings>(this.baseUrl, ahorro);
  }

  public actualizarAhorro(id: number, data: Savings): Observable<Savings> {
    return this.http.put<Savings>(`${this.baseUrl}/${id}`, data);
  }

  public eliminarAhorro(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  public getAhorroPorId(id: number): Observable<Savings> {
    return this.http.get<Savings>(`${this.baseUrl}/${id}`);
  }
}
