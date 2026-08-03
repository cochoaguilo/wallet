import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DeudasService } from '../services/deudas.service';
import { Subscription } from 'rxjs';
import { Forms } from 'src/interfaces/forms';
import { Deudas } from 'src/interfaces/deudas';
import { HttpResponse } from 'src/interfaces/http-response';
import { NotificationComponent, themeColor } from '../components/notification/notification.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class Tab3Page implements OnInit, OnDestroy {

  mostrarFormulario = signal(false);
  mostrarModalEliminar = false;
  formData: Record<string, any> | null = null;
  deudaAEliminar!: Deudas;
  private userId:number;
  public deudas= signal<Deudas[]>([]);
  toastMessage = signal('');
  colorType: themeColor ="primary";
  private deudasService = inject(DeudasService);

  formFields: Forms[] = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'text', required: false },
    { name: 'amount', label: 'Monto', type: 'number', required: true },
  ];
  editarIndex: number | undefined;
  editarId: any;
  notificationComponent!: NotificationComponent;
  subscriptions: Subscription[] = [];

  constructor() {
    const user = JSON.parse(sessionStorage.getItem("USER") || "{}");
    this.userId = user.id;
  }

  private mostrarNotificacion(mensaje: string, colorType: themeColor) {
    this.colorType = colorType;
    this.toastMessage.set(mensaje);
    this.notificationComponent?.setOpen(true);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.deudasService.getDeudas(this.userId).subscribe((data: HttpResponse<Deudas[]>) => {
        if (data.success) {
          this.deudas.set(data.data as Deudas[]);
        } else {
          this.mostrarNotificacion('No se pudo lograr la acción', 'danger');
        }
      })
    );
  }

  agregarEditarDeuda(deuda: Deudas) {
    const esEdicion = !!deuda.id;
    const operacion = esEdicion
      ? this.deudasService.actualizarDeuda(deuda.id, deuda)
      : this.deudasService.agregarDeuda(deuda, this.userId);

    this.subscriptions.push(
      operacion.subscribe((data: HttpResponse<Deudas>) => {
        if (data.success) {
          const nuevaDeuda = data.data ?? deuda;
          if (esEdicion) {
            this.deudas.update((actual) => actual.map((item) => item.id === nuevaDeuda.id ? nuevaDeuda : item));
          } else {
            this.deudas.update((actual) => [...actual, nuevaDeuda]);
          }
          this.mostrarNotificacion(esEdicion ? 'editado con exito' : 'agregado con exito', 'success');
        } else {
          this.mostrarNotificacion('No se pudo lograr la acción', 'danger');
        }
      })
    );
    this.cerrarFormulario();
  }

  editarDeuda(deuda: any, index: number) {
    this.editarIndex = index;
    this.editarId = deuda.id;
    this.formData = {
      name: deuda.name,
      description: deuda.description,
      amount: deuda.amount,
      id: deuda.id
    };
    this.mostrarFormulario.set(true);
  }
  get modalTitle(): string {
    return this.editarId !== null && this.editarId !== undefined ? 'Editar deuda' : 'Agregar deuda';
  }

  abrirFormularioNuevo() {
    this.editarIndex = undefined;
    this.editarId = null;
    this.formData = null;
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.editarIndex = undefined;
    this.editarId = null;
    this.formData = null;
    this.mostrarFormulario.set(false);
  }

  eliminarDeuda(deuda: Deudas) {
  this.deudaAEliminar = deuda;
  this.mostrarModalEliminar = true;
  }
  confirmarEliminarDeuda() {
  if (this.deudaAEliminar) {
    const index = this.deudas().findIndex(d => d === this.deudaAEliminar);
    if (index > -1) {
      this.subscriptions.push(
        this.deudasService.eliminarDeuda(this.deudaAEliminar.id).subscribe((response: HttpResponse<void>) => {
          if (response.success) {
            this.deudas.update((actual) => actual.filter((_, i) => i !== index));
            this.mostrarNotificacion('eliminado con exito', 'success');
          } else {
            this.mostrarNotificacion('No se pudo lograr la acción', 'danger');
          }
        })
      );
    }
  }
  this.mostrarModalEliminar = false;
}

ngOnDestroy(): void {
  this.subscriptions.forEach(sub => sub.unsubscribe())
}

}
