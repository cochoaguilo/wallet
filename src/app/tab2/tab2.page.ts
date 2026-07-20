import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { InversionesService } from '../services/inversiones.service';
import { Investments } from 'src/interfaces/investments';
import { FormComponent } from '../components/form/form.component';
import { Subscription, of, take } from 'rxjs';
import { Forms } from 'src/interfaces/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  @ViewChild(FormComponent) formComponent!: FormComponent;
  criptos = signal<any[]>([]);
  acciones = signal<any[]>([]);
  bonos: any[] = [];
  loading = signal(false);
  totalCriptos = signal(0);
  totalAcciones = signal(0);
  totalGeneral = signal(0);
  private subscriptions: Subscription[] = [];
  private userId: number;

  holdings: any;
  private inversionesService = inject(InversionesService);

mostrarFormulario = false;

formFields: Forms[] = [
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
  { name: 'hold', label: 'Tenencia', type: 'number', required: true },
  { name: 'platform', label: 'Plataforma', type: 'text', required: false },
  { name: 'purchaseDate', label: 'Fecha de compra', type: 'date', required: false }
];


  constructor() {
    const user = JSON.parse(sessionStorage.getItem("USER") || "{}");
    this.userId = user.id;
  }

  ordenCripto = '';
ordenAccion = '';
criterioCripto = 'mayorPrecio';
criterioAccion = 'mayorPrecio';
editarIndexCripto: number | null = null;
criptoAEditar: any = null;

/* getCriptoOptions() {
  return this.criptos
    .map(c => ({
      symbol: c.symbol,
      name: c.name,
      value: (this.holdings[c.symbol] || 0) * c.current_price
    }))
    .sort((a, b) => b.value - a.value);
} */

/* getAccionOptions() {
  return this.acciones
    .map(a => ({
      symbol: a.symbol,
      name: a.name || a.symbol,
      value: (this.holdingsAcciones[a.symbol] || 0) * a.price
    }))
    .sort((a, b) => b.value - a.value);
} */


  ngOnInit() {
    this.cargarInversiones();
  }

  private cargarInversiones() {
    this.loading.set(true);
    this.subscriptions.push(
      this.inversionesService.getAllTypeInvestment(this.userId).pipe(
        take(1)
      ).subscribe({
        next: (data) => {
          this.criptos.set(data.criptos ?? []);
          this.acciones.set(data.acciones ?? []);
          this.calcularTotales();
          this.loading.set(false);
        },
        error: (err) => {
          alert(err)
          this.loading.set(false);
        }
      })
    );
  }

  agregarInversion(item: Investments) {
    console.log(this.editarIndexCripto);
    
    if (item.tipo === 'cripto') {
        this.editarIndexCripto == null || this.editarIndexCripto < 0 ? 
        this.subscriptions.push(this.inversionesService.agregarCripto(item, this.userId).subscribe({
        next: () => {
          this.cargarInversiones();
        },
        error: (err) => {
          console.error('Error al agregar criptomoneda:', err);
        }
      })) : this.subscriptions.push(this.inversionesService.actualizarCripto(item.id, item).subscribe({
        next: () => {
          this.cargarInversiones();
          this.editarIndexCripto = null;
        },
        error: (err) => {
          console.error('Error al editar criptomoneda:', err);
        }
      }));
      
    } else if (item.tipo === 'accion') {
      this.subscriptions.push(this.inversionesService.agregarInversion(item).subscribe({
        next: () => {
          this.cargarInversiones();
        },
        error: (err) => {
          console.error('Error al agregar acción:', err);
        }
      }));
    }
    //this.calcularTotales();
    this.mostrarFormulario = false;
  }

  calcularTotales() {
    const criptosActuales = this.criptos();
    const accionesActuales = this.acciones();

    this.totalCriptos.set(criptosActuales.reduce((acc, cripto) =>
      acc + ((cripto.hold || 0) * cripto.price), 0));

    this.totalAcciones.set(accionesActuales.reduce((acc, accion) =>
      acc + ((accion.hold || 0) * accion.price), 0));

    this.totalGeneral.set(this.totalCriptos() + this.totalAcciones());
  }

  editarCripto(cripto: any, index: number) {
  this.editarIndexCripto = index;
  this.criptoAEditar = cripto;
  this.mostrarFormulario = true;
    
  /* setTimeout(() => {
    if (this.formComponent && this.formComponent.categoriaForm) {
      this.formComponent.categoriaForm.patchValue({
        tipo: 'cripto',
        symbol: cripto.symbol,
        name: cripto.name,
        hold: cripto.hold,
        plataforma: cripto.plataforma,
        fecha: cripto.fecha
      });
    }
  }); */
}
editarAccion(accion: any, index: number) {
  this.editarIndexCripto = index;
  this.criptoAEditar = accion;
  this.mostrarFormulario = true;
    
  /* setTimeout(() => {
    if (this.formComponent && this.formComponent.categoriaForm) {
      this.formComponent.categoriaForm.patchValue({
        tipo: 'accion',
        symbol: accion.symbol,
        name: accion.name,
        hold: accion.hold,
        plataforma: accion.plataforma,
        fecha: accion.fecha
      });
    }
  }); */
}

eliminarAccion(id: number) {
  this.subscriptions.push(this.inversionesService.eliminarInversion(id).subscribe(() => {
    this.acciones.update((actual) => actual.filter(c => c.id !== id));
    this.calcularTotales();
  }));
}

eliminarCripto(id: number) {
  this.subscriptions.push(this.inversionesService.eliminarCripto(id).subscribe(() => {
    this.criptos.update((actual) => actual.filter(c => c.id !== id));
    this.calcularTotales();
  }));
}

ngOnDestroy(): void {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}

}
