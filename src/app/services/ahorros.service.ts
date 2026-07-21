import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Savings } from '../../interfaces/savings.js';
import { HttpResponse } from 'src/interfaces/http-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AhorrosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/ahorros`;

  public getAhorros(userId: number): Observable<HttpResponse<Savings[]>> {
    return this.http.get<HttpResponse<Savings[]>>(this.baseUrl + '?userId=' + userId);
  }

  public getAhorrosTotales(userId: number): Observable<HttpResponse<number>> {
    return this.http.get<HttpResponse<number>>(`${this.baseUrl}/totales?userId=${userId}`);
  }

  public agregarAhorro(ahorro:Savings): Observable<HttpResponse<Savings>> {
    return this.http.post<HttpResponse<Savings>>(this.baseUrl, ahorro);
  }

  public actualizarAhorro(data: Savings, id:number | null): Observable<HttpResponse<Savings>> {
    return this.http.patch<HttpResponse<Savings>>(`${this.baseUrl}/${id}`, data);
  }

  public eliminarAhorro(id: number): Observable<HttpResponse<void>> {
    return this.http.delete<HttpResponse<void>>(`${this.baseUrl}/${id}`);
  }

  public getAhorroPorId(id: number): Observable<HttpResponse<Savings>> {
    return this.http.get<HttpResponse<Savings>>(`${this.baseUrl}/${id}`);
  }
}
