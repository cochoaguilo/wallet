import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeudasService {
  private deudasSubject = new BehaviorSubject<any[]>([]);
  deudas$ = this.deudasSubject.asObservable();

  getDeudas() {
    return this.deudasSubject.value;
  }

  agregarDeuda(deuda: any) {
    const deudas = [...this.deudasSubject.value, deuda];
    this.deudasSubject.next(deudas);
  }

  getTotalDeudas(): number {
    return this.deudasSubject.value.reduce((acc, d) => acc + Number(d.monto), 0);
  }
}