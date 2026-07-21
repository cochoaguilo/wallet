import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { HttpResponse } from 'src/interfaces/http-response';
import { Investments } from 'src/interfaces/investments';
import { environment } from '../../environments/environment';
import { Cotizaciones } from 'src/interfaces/cotizaciones';

@Injectable({
  providedIn: 'root'
})
export class InversionesService {
  private http = inject(HttpClient);
  constructor() {}

  private criptoUrl = `${environment.apiUrl}/cripto`;
  private inversionesUrl = `${environment.apiUrl}/inversiones`;
  private externalsUrl = `${environment.apiUrl}/externals`;

  getCripto(userId:number): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(this.criptoUrl + "?userId=" + userId);
  }

  agregarCripto(data: any, userId:number): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(this.criptoUrl+ "?userId=" + userId, data);
  }

  actualizarCripto(id: number, data: any): Observable<HttpResponse<any>> {
    return this.http.put<HttpResponse<any>>(`${this.criptoUrl}/${id}`, data);
  }

  eliminarCripto(id: number): Observable<HttpResponse<void>> {
    return this.http.delete<HttpResponse<void>>(`${this.criptoUrl}/${id}`);
  }

  getInversionPorId(id: number): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.inversionesUrl}/${id}`);
  }

  getInversion(userId:number): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(this.inversionesUrl+ "?userId=" + userId);
  }

  agregarInversion(data: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(this.inversionesUrl, data);
  }

  editarInversion(id: number, data: any): Observable<HttpResponse<any>> {
    return this.http.patch<HttpResponse<any>>(`${this.inversionesUrl}/${id}`, data);
  }

  eliminarInversion(id: number): Observable<HttpResponse<void>> {
    return this.http.delete<HttpResponse<void>>(`${this.inversionesUrl}/${id}`);
  }

  // Ejemplo: obtener precios de criptomonedas populares
  getCriptosAPI(symbols: string[]): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(this.externalsUrl + '/cripto_currency' + '?symbols=' + symbols.join(','));
  }

  // Ejemplo: obtener precios de acciones populares (Financial Modeling Prep)
  getPreciosAccionesAPI(): Observable<any> {
    return this.http.get(this.externalsUrl + '/rava');
  }

  getCotizacionesDolares(): Observable<HttpResponse<Cotizaciones[]>> {
    return this.http.get<HttpResponse<Cotizaciones[]>>(this.externalsUrl + '/dolar_exchange');
  }

  // Obtener todo junto
  getAllTypeInvestment(userId:number): Observable<any> {
    return forkJoin({
      criptos: this.getCriptoConPrecio(userId),
      acciones: this.getAccionesConPrecio(userId),
    });
  }

  getAccionesConPrecio(userId:number): Observable<any[]> {
    const dolarMEPStored = sessionStorage.getItem('dolarMEP'); 
    return this.getInversion(userId).pipe(
      switchMap((response: HttpResponse<Investments[]>) => {
        if (!response.success) return of([]);
        const misAcciones = response.data ?? [];
        const symbols = misAcciones.map((c: any) => c.symbol);
        if (!symbols.length || symbols.length === 0) return of([]);
        return this.getPreciosAccionesAPI().pipe(
          map((precios: HttpResponse<any[]>) => {
            if (!precios.success) return [];
            // Filtrar precios para que solo queden los símbolos que están en misAcciones
            // los símbolos se repiten ya que la API devuelve varias cotizaciones por símbolo,
            // por lo que se filtra para que solo quede uno por símbolo
            const uniqueSymbols = new Set<string>();

            const preciosfiltered = !precios.data? [] : precios.data?.filter((precio: any) => {
              if (!symbols.includes(precio.simbolo) || uniqueSymbols.has(precio.simbolo)) {
                return false;
              }

              uniqueSymbols.add(precio.simbolo);
              return true;
            });

            return preciosfiltered.map((precio: any) => {
              const local = misAcciones.find((c: any) => (c.symbol as string).toLowerCase() === precio.simbolo.toLowerCase());
              return {
                ...local,
                price: Number(precio.ultimo) / (dolarMEPStored ? JSON.parse(dolarMEPStored).sell: 1),
                moneda: precio.moneda,
              };
            });
          })
        );
      })
    );
  }

  getCriptoConPrecio(userId:number): Observable<any[]> {
    return this.getCripto(userId).pipe(
      switchMap((response: HttpResponse<Investments[]>) => {
        if (!response.success) return of([]);
        const misCriptos = response.data ?? [];
        
        const symbols = misCriptos.map((c: any) => c.symbol);
        if (!symbols.length || symbols.length === 0) return of([]);
        return this.getCriptosAPI(symbols).pipe(
          map((precios: HttpResponse<any[]>) => {
            if(!precios.success)return [];
            
            return precios.data.map((precio: any) => {
              const local = misCriptos.find((c: any) => (c.symbol as string).toLowerCase() === precio.symbol);
              return {
                ...local,
                price: Number(precio.current_price)
              };
            });
          })
        );
      })
    );
  }
}