import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeudasService {
  private deudasSubject = new BehaviorSubject<any[]>([]);
  deudas$ = this.deudasSubject.asObservable();

  private apiUrl = 'https://tuservidor.com/api/deudas';

  constructor(private http: HttpClient) {}

  getDeudas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  agregarDeuda(deuda: any): Observable<any> {
    const deudas = [...this.deudasSubject.value, deuda];
    this.deudasSubject.next(deudas);
    return this.http.post<any>(this.apiUrl, deuda);
  }

  actualizarDeuda(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  eliminarDeuda(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDeudaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getTotalDeudas(): number {
    return this.deudasSubject.value.reduce((acc, d) => acc + Number(d.monto), 0);
  }
}