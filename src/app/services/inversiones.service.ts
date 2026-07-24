import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concat, firstValueFrom, forkJoin, map, of, switchMap, take } from 'rxjs';
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

  async agregarCripto(data: Investments, userId:number): Promise<Observable<HttpResponse<any>>> {
   let errorResponse = of({
           status: 'error',
           success: false,
           message: 'El símbolo no se pudo encontrar',
           data: null
         } as HttpResponse<any>);
   const apiResponse = await firstValueFrom(this.getCriptosAPI([data.symbol]).pipe(take(1)))
   if(apiResponse.success && apiResponse.data.length == 1 ) {
    //la api si no encuentra la moneda te devuelve la lista completa
      return this.http.post<HttpResponse<any>>(this.criptoUrl+ "?userId=" + userId, data);
   } else {
      return errorResponse
   }
  }

  actualizarCripto(id: number, data: any, userId: number): Observable<HttpResponse<any>> {
    data.tipo = undefined;
    return this.http.patch<HttpResponse<any>>(`${this.criptoUrl}/${id}`, {...data, userId});
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

  async agregarInversion(data: Investments, userId:number): Promise<Observable<HttpResponse<any>>> {
    try {
      await firstValueFrom(this.getAPIacciones(data.symbol));
      // si encuentra la acción se guarda en la base de datos
      return this.http.post<HttpResponse<any>>(this.inversionesUrl + "?userId=" + userId, data);
    } catch (error) {
      return of({
        status: 'error',
        success: false,
        message: 'El símbolo no se pudo encontrar',
        data: null
      } as HttpResponse<any>);
    }
  }

  editarInversion(id: number, data: any): Observable<HttpResponse<any>> {
    data.tipo = undefined;
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
  getAPIacciones(symbol: string): Observable<any> {
    return this.http.get(this.externalsUrl + '/iol?symbol=' + symbol);
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
        let obs$: Observable<any>[] = []
        for (const accion of misAcciones) {
          obs$.push(
            this.getAPIacciones(accion.symbol).pipe(
              map((data: HttpResponse<any>)=>{
                if (!data.success) return {}
                const response = data.data;
                let price = Number(response.ultimoPrecio);
                if (response.descripcionTitulo.includes("Bono") || 
                response.descripcionTitulo.includes("Cupon") ) {
                  price = price / 100
                }
                //si la moneda es pesos pasarlo a dolar mep
                const priceCalculated = response.moneda == "peso_Argentino" ? price /
                (dolarMEPStored ? JSON.parse(dolarMEPStored).sell: 1): price;
                return {
                  ...accion,
                  price: priceCalculated,
                  moneda: response.moneda,
                };
              })
            )
          )
        }
        return forkJoin(obs$)
        /* const symbols = misAcciones.map((c: any) => c.symbol);
        if (!symbols.length || symbols.length === 0) return of([]);
        return this.getAPIacciones().pipe(
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
              const price = Number(precio.ultimo)
              const priceCalculated = precio.moneda == 'USD' ? price : price /
              (dolarMEPStored ? JSON.parse(dolarMEPStored).sell: 1);
              return {
                ...local,
                price: priceCalculated,
                moneda: precio.moneda,
              };
            });
          })
        ); */
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