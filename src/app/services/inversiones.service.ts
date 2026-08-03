import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap, take } from 'rxjs';
import { HttpResponse } from 'src/interfaces/http-response';
import { Investments } from 'src/interfaces/investments';
import { environment } from '../../environments/environment';
import { Cotizaciones } from 'src/interfaces/cotizaciones';

@Injectable({
  providedIn: 'root'
})
export class InversionesService {
  private http = inject(HttpClient);
  private dolarMEPStored = sessionStorage.getItem('dolarMEP');
  constructor() {}

  private criptoUrl = `${environment.apiUrl}/cripto`;
  private inversionesUrl = `${environment.apiUrl}/inversiones`;
  private externalsUrl = `${environment.apiUrl}/externals`;

  getCripto(userId:number): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(this.criptoUrl + "?userId=" + userId);
  }

  agregarCripto(data: Investments, userId:number): Observable<HttpResponse<any>> {
    const errorResponse = {
      status: 'error',
      success: false,
      message: 'El símbolo no se pudo encontrar',
      data: null
    } as HttpResponse<any>;

    return this.getCriptosAPI([data.symbol]).pipe(
      take(1),
      switchMap((apiResponse: HttpResponse<any[]>) => {
        const precio = apiResponse?.data?.[0]?.current_price;
        if (!apiResponse?.success || apiResponse.data.length > 1) {
          return of(errorResponse);
        }

        return this.http.post<HttpResponse<any>>(this.criptoUrl + "?userId=" + userId, data).pipe(
          map((postResponse: HttpResponse<any>) => {
            if (!postResponse.success) {
              return postResponse;
            }

            return {
              ...postResponse,
              data: {
                ...(postResponse.data ?? {}),
                price: Number(precio),
              }
            };
          })
        );
      }),
      catchError(() => of(errorResponse))
    );
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

  agregarInversion(data: Investments, userId:number): Observable<HttpResponse<any>> {
    const errorResponse = {
      status: 'error',
      success: false,
      message: 'El símbolo no se pudo encontrar',
      data: null
    } as HttpResponse<any>;

    return this.getAPIacciones(data.symbol).pipe(
      take(1),
      switchMap((apiResponse: any) => {
        const ultimoPrecio = apiResponse?.data?.ultimoPrecio;

        if (!apiResponse?.success || ultimoPrecio == null || Number.isNaN(Number(ultimoPrecio))) {
          return of(errorResponse);
        }

        return this.http.post<HttpResponse<any>>(this.inversionesUrl + "?userId=" + userId, data).pipe(
          map((postResponse: HttpResponse<any>) => {
            if (!postResponse.success) {
              return postResponse;
            }

            //si la moneda es pesos pasarlo a dolar mep
            const priceCalculated = apiResponse.data?.moneda == "peso_Argentino" ? ultimoPrecio /
            (this.dolarMEPStored ? JSON.parse(this.dolarMEPStored).sell: 1): ultimoPrecio;

            return {
              ...postResponse,
              data: {
                ...(postResponse.data ?? {}),
                price: priceCalculated,
              }
            };
          })
        );
      }),
      catchError(() => of(errorResponse))
    );
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
    return this.getInversion(userId).pipe(
      switchMap((response: HttpResponse<Investments[]>) => {
        const misAcciones = response.data ?? [];
        if (!response.success || misAcciones.length == 0) return of([]);
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
                (this.dolarMEPStored ? JSON.parse(this.dolarMEPStored).sell: 1): price;
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