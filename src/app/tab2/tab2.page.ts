import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { InversionesService } from '../services/inversiones.service';
import { Investments } from 'src/interfaces/investments';
import { FormComponent } from '../components/form/form.component';
import { NotificationComponent, themeColor } from '../components/notification/notification.component';
import { Observable, Subject, take, takeUntil, takeWhile } from 'rxjs';
import { Forms } from 'src/interfaces/forms';
import { HttpResponse } from 'src/interfaces/http-response';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  @ViewChild(FormComponent) formComponent!: FormComponent;
  @ViewChild(NotificationComponent) notificationComponent!: NotificationComponent;
  criptos = signal<Investments[]>([]);
  acciones = signal<Investments[]>([]);
  loading = signal(false);
  toastMessage = signal('');
  mostrarValores = signal(true);
  mostrarModalEliminar = false;
  instrumentoAEliminar!:Investments;
  colorType: themeColor ="primary";
  currentItemId = signal<number | null>(null);
  formData: Record<string, any> | null = null;
  totalCriptos = signal(0);
  totalAcciones = signal(0);
  totalGeneral = signal(0);
  private userId: number;
  private destroy$ = new Subject<void>();

  private inversionesService = inject(InversionesService);

mostrarFormulario = signal(false);

formFields: Forms[] = [
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: [
      { label: 'Criptomoneda', value: 'cripto' },
      { label: 'Instrumento', value: 'accion' }
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
criterioCripto = 'mayorValor';
criterioAccion = 'mayorValor';


  ngOnInit() {
    this.cargarInversiones();
  }

  private cargarInversiones() {
    this.loading.set(true);
    this.inversionesService.getAllTypeInvestment(this.userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {                
        this.criptos.set(data.criptos ?? []);
        this.acciones.set(data.acciones ?? []);
        this.calcularTotales();
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
      }
    });
  }

  private mostrarNotificacion(mensaje: string) {
    this.toastMessage.set(mensaje);
    this.notificationComponent?.setOpen(true);
  }

  public submitForm(item: Investments) {
    item.symbol = item.symbol.toLocaleUpperCase();
    if (item.tipo == 'accion') {
      this.agregarEditarAccion(item)
    } else {
      this.agregarEditarCripto(item)
    }
    this.cerrarFormulario();

  }

  get modalTitle(): string {
    return this.currentItemId() !== null || this.formData !== null ? 'Editar inversión' : 'Agregar inversión';
  }

  abrirFormularioNuevo() {
    this.currentItemId.set(null);
    this.formData = null;
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.currentItemId.set(null);
    this.formData = null;
    this.mostrarFormulario.set(false);
  }
  

  private async agregarEditarCripto(item: Investments) {
    const esEdicion = !!item.id;

    const solicitud = esEdicion
      ? this.inversionesService.actualizarCripto(item.id, item, this.userId).pipe(take(1))
      : (await this.inversionesService.agregarCripto(item, this.userId)).pipe(take(1));

    solicitud.subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.success) {
          const itemPersistido = response.data ?? item;
          if (esEdicion) {
            this.criptos.update((actual) => actual.map((cripto) => cripto.id === itemPersistido.id ? { ...cripto, ...itemPersistido } : cripto));
          } else {
            this.criptos.update((actual) => [...actual, itemPersistido]);
          }
          this.calcularTotales();
          this.mostrarNotificacion(esEdicion ? 'Editado con exito' : 'Agregado con exito');
          this.colorType = 'success';
        } else {
          this.mostrarNotificacion(response.message || 'No se pudo lograr la acción');
          this.colorType = 'danger';
        }
      },
      error: () => (this.mostrarNotificacion('No se pudo lograr la acción'), this.colorType = 'danger')
    });
  }

  private async agregarEditarAccion(item: Investments) {
    const esEdicion = !!item.id;
    const solicitud = esEdicion
      ? this.inversionesService.editarInversion(item.id, item).pipe(take(1))
      : ( this.inversionesService.agregarInversion(item, this.userId)).pipe(take(1));

    solicitud.subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.success) {
          const itemPersistido = response.data ?? item;
          if (esEdicion) {
            this.acciones.update((actual) => actual.map((accion) => accion.id === itemPersistido.id ? { ...accion, ...itemPersistido } : accion));
          } else {
            this.acciones.update((actual) => [...actual, itemPersistido]);
          }
          this.calcularTotales();
          this.mostrarNotificacion(esEdicion ? 'Editado con exito' : 'Agregado con exito');
          this.colorType = 'success';
        } else {
          this.mostrarNotificacion(response.message || 'No se pudo lograr la acción');
          this.colorType = 'danger';
        }
      },
      error: () => (this.mostrarNotificacion('No se pudo lograr la acción'), this.colorType = 'danger')
    });
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

  cargarFormCripto(cripto: any) {
    this.currentItemId.set(cripto?.id ?? null);
    this.formData = {
      tipo: 'cripto',
      symbol: cripto.symbol,
      name: cripto.name,
      hold: cripto.hold,
      platform: cripto.platform,
      purchaseDate: cripto.purchaseDate,
      id: cripto.id
    };
    this.mostrarFormulario.set(true);
  }

  cargarFormAccion(accion: any) {
    this.currentItemId.set(accion?.id ?? null);
    this.formData = {
      tipo: 'accion',
      symbol: accion.symbol,
      name: accion.name,
      hold: accion.hold,
      platform: accion.platform,
      purchaseDate: accion.purchaseDate,
      id: accion.id
    };
    this.mostrarFormulario.set(true);
  }

showModalEliminar(instrumento: Investments){
  this.instrumentoAEliminar = instrumento;
  this.mostrarModalEliminar = true;
}

eliminarAccion(id: number) {
  this.inversionesService.eliminarInversion(id).pipe(take(1)).subscribe({
    next: (response: HttpResponse<void>) => {
      if (response.success) {
        this.acciones.update((actual) => actual.filter(c => c.id !== id));
        this.calcularTotales();
        this.mostrarNotificacion('eliminado con exito');
      } else {
        this.mostrarNotificacion('No se pudo lograr la acción');
      }
    },
    error: () => this.mostrarNotificacion('No se pudo lograr la acción')
  });
  this.mostrarModalEliminar = false;
}

eliminarCripto(id: number) {
  this.inversionesService.eliminarCripto(id).pipe(take(1)).subscribe({
    next: (response: HttpResponse<void>) => {
      if (response.success) {
        this.criptos.update((actual) => actual.filter(c => c.id !== id));
        this.calcularTotales();
        this.mostrarNotificacion('eliminado con exito');
      } else {
        this.mostrarNotificacion('No se pudo lograr la acción');
      }
    },
    error: () => this.mostrarNotificacion('No se pudo lograr la acción')
  });
  this.mostrarModalEliminar = false;
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
}
