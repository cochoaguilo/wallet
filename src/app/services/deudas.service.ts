import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Deudas } from 'src/interfaces/deudas';
import { HttpResponse } from 'src/interfaces/http-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeudasService {
  private deudasSubject = new BehaviorSubject<any[]>([]);
  deudas$ = this.deudasSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/deudas`;
  private http = inject(HttpClient);

  constructor() {}

  getDeudas(userId: number): Observable<HttpResponse<Deudas[]>> {
    return this.http.get<HttpResponse<Deudas[]>>(this.apiUrl + '?userId=' + userId,);
  }

  agregarDeuda(deuda: Deudas, userId: number): Observable<HttpResponse<Deudas>> {
    const deudas = [...this.deudasSubject.value, deuda];
    this.deudasSubject.next(deudas);
    return this.http.post<HttpResponse<Deudas>>(this.apiUrl + '?userId=' + userId, deuda);
  }

  actualizarDeuda(id: number, data: Deudas): Observable<HttpResponse<Deudas>> {
    return this.http.put<HttpResponse<Deudas>>(`${this.apiUrl}/${id}`, data);
  }

  eliminarDeuda(id: number): Observable<HttpResponse<void>> {
    return this.http.delete<HttpResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getDeudaPorId(id: number): Observable<HttpResponse<Deudas>> {
    return this.http.get<HttpResponse<Deudas>>(`${this.apiUrl}/${id}`);
  }

  getTotalDeudas(userId: number): Observable<HttpResponse<number>> {
    return this.http.get<HttpResponse<number>>(`${this.apiUrl}/totales?userId=${userId}`);
  }
}