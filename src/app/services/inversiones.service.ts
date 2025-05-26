import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InversionesService {
  constructor(private http: HttpClient) {}

  // Ejemplo: obtener precios de criptomonedas populares
  getCriptos() {
    return this.http.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
  }

  // Ejemplo: obtener precios de acciones populares (Financial Modeling Prep)
  getAcciones() {
    return this.http.get('https://financialmodelingprep.com/api/v3/quote/AAPL,GOOGL,MSFT,AMZN,TSLA?apikey=sQ0rM813SYcGJPMYohDUfUdN2UtCFT0O');
  }

  // Ejemplo: obtener bonos del Tesoro de EE.UU.
  getBonos() {
    return this.http.get('https://financialmodelingprep.com/api/v3/quotes/treasury?apikey=sQ0rM813SYcGJPMYohDUfUdN2UtCFT0O');
  }

  // Obtener todo junto
  getInversiones() {
    return forkJoin({
      criptos: this.getCriptos(),
      acciones: this.getAcciones(),
    });
  }
}