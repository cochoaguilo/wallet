import { Component, OnInit } from '@angular/core';
import { InversionesService } from '../services/inversiones.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  criptos: any[] = [];
  acciones: any[] = [];
  //bonos: any[] = [];
  loading = true;

  holdings: any = {
    btc: 0.05,
    eth: 0.8,
    usdt: 100,
    // ...otros símbolos y cantidades
  };

  holdingsAcciones: any = {
  AAPL: 2,     // 2 acciones de Apple
  GOOGL: 1.5,  // 1.5 acciones de Google
  MSFT: 3,     // 3 acciones de Microsoft
  AMZN: 0.7,   // 0.7 acciones de Amazon
  TSLA: 1      // 1 acción de Tesla
  // ...otros símbolos y cantidades
};

totalCriptos = 0;
totalAcciones = 0;
totalGeneral = 0;

mostrarFormulario = false;

formFields = [
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: [
      { label: 'Criptomoneda', value: 'cripto' },
      { label: 'Acción', value: 'accion' }
    ],
    required: true
  },
  { name: 'symbol', label: 'Símbolo', type: 'text', required: true },
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'holdings', label: 'Tenencia', type: 'number', required: true },
  { name: 'plataforma', label: 'Plataforma', type: 'text', required: true },
  { name: 'fecha', label: 'Fecha de compra', type: 'date', required: true }
];

  constructor(private inversionesService: InversionesService) {}

  ordenCripto = '';
ordenAccion = '';
criterioCripto = 'mayorPrecio';
criterioAccion = 'mayorPrecio';

getCriptoOptions() {
  return this.criptos
    .map(c => ({
      symbol: c.symbol,
      name: c.name,
      value: (this.holdings[c.symbol] || 0) * c.current_price
    }))
    .sort((a, b) => b.value - a.value);
}

getAccionOptions() {
  return this.acciones
    .map(a => ({
      symbol: a.symbol,
      name: a.name || a.symbol,
      value: (this.holdingsAcciones[a.symbol] || 0) * a.price
    }))
    .sort((a, b) => b.value - a.value);
}

  ngOnInit() {
    this.inversionesService.getInversiones().subscribe({
      next: (data) => {
        this.criptos = data.criptos as any[];
        this.acciones = data.acciones as any[];
        //this.bonos = data.bonos as any[];
        this.calcularTotales();
        // Selecciona por defecto la de mayor valor
        /* const criptoOpts = this.getCriptoOptions();
        this.ordenCripto = criptoOpts.length ? criptoOpts[0].symbol : '';
        const accionOpts = this.getAccionOptions();
        this.ordenAccion = accionOpts.length ? accionOpts[0].symbol : ''; */
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  agregarInversion(item: any) {
    if (item.tipo === 'cripto') {
      this.holdings[item.symbol] = Number(item.holdings);
    } else if (item.tipo === 'accion') {
      this.holdingsAcciones[item.symbol] = Number(item.holdings);
    }
    this.calcularTotales();
    this.mostrarFormulario = false;
  }

  calcularTotales() {
  this.totalCriptos = this.criptos.reduce((acc, cripto) =>
    acc + ((this.holdings[cripto.symbol] || 0) * cripto.current_price), 0);

  this.totalAcciones = this.acciones.reduce((acc, accion) =>
    acc + ((this.holdingsAcciones[accion.symbol] || 0) * accion.price), 0);

  this.totalGeneral = this.totalCriptos + this.totalAcciones;
}

}
