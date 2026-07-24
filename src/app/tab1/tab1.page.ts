import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Savings } from 'src/interfaces/savings';
import { AhorrosService } from '../services/ahorros.service';
import { FormComponent } from '../components/form/form.component';
import { NotificationComponent } from '../components/notification/notification.component';
import { Subscription } from 'rxjs';
import { Forms } from 'src/interfaces/forms';
import { HttpResponse } from 'src/interfaces/http-response';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  @ViewChild(FormComponent) formComponent!: FormComponent;
  private ahorrosService = inject(AhorrosService);
  private userId:number;

  constructor(
  ) {
    const user = JSON.parse(sessionStorage.getItem("USER") || "{}");
    this.userId = user.id;
  }

  public categorias = signal<Savings[]>([]);
  toastMessage = signal('');
  isToastOpen = signal(false)

  mostrarFormulario = false;
  editarIndex: number | null = null;
  editarId: number  | null = null;
  private subscriptions: Subscription[] = [];
  mostrarModalEliminar = false;
  categoriaAEliminar: any = null;

  formFields: Forms[] = [
  { name: 'type', label: 'Tipo', type: 'select', required: true, options: [
    { label: 'Gasto', value: 'gasto' },
    { label: 'Ingreso', value: 'ingreso' }
  ]},
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'description', label: 'Descripción', type: 'text', required: false },
  { name: 'date', label: 'Fecha', type: 'date', required: false },
  { name: 'quantity', label: 'Cantidad', type: 'number', required: true }
];

ngOnInit(): void {
  this.subscriptions.push(
    this.ahorrosService.getAhorros(this.userId).subscribe((data: HttpResponse<Savings[]>) => {
      this.categorias.set(data.data ?? []);
    })
  );
}

  private mostrarNotificacion(mensaje: string) {
    this.toastMessage.set(mensaje);
    this.isToastOpen.set(true);
  }

  agregarModificarCategoria(data: Savings) {
    if (this.editarIndex !== null) {
      this.subscriptions.push(
        this.ahorrosService.actualizarAhorro(data, this.editarId).subscribe({
          next: (response: HttpResponse<Savings>) => {
            if (response.success) {
              const itemActualizado = response.data ?? data;
              this.categorias.update((actual) => {
                const copia = [...actual];
                if (this.editarIndex !== null) {
                  copia[this.editarIndex] = itemActualizado;
                }
                return copia;
              });
              this.mostrarNotificacion('editado con exito');
            } else {
              this.mostrarNotificacion('No se pudo lograr la acción');
            }
            this.editarIndex = null;
          },
          error: () => this.mostrarNotificacion('No se pudo lograr la acción')
        })
      );
    } else {
      this.subscriptions.push(
        this.ahorrosService.agregarAhorro(data, this.userId).subscribe({
          next: (response: HttpResponse<Savings>) => {
            if (response.success) {
              this.categorias.update((actual) => [...actual, response.data ?? { ...data, id: Date.now() }]);
              this.mostrarNotificacion('agregado con exito');
            } else {
              this.mostrarNotificacion('No se pudo lograr la acción');
            }
          },
          error: () => this.mostrarNotificacion('No se pudo lograr la acción')
        })
      );
    }

    this.mostrarFormulario = false;
  }

  editarCategoria(categoria: Savings, index: number) {

  this.editarIndex = index;
  this.mostrarFormulario = true;
  this.editarId = categoria.id;
  
  // Rellena el formulario con los datos de la categoría seleccionada
  setTimeout(() => {
      if (this.formComponent && this.formComponent.categoriaForm) {
        this.formFields.forEach(field => {
          if (this.formComponent.categoriaForm.get(field.name)) {
            const key = field.name as keyof Savings;
            this.formComponent.categoriaForm.get(field.name)?.setValue(categoria[key]);
          }
        });
      }
    });
}

  get ingresos() {
    return this.categorias().filter(c => c.type === 'ingreso');
  }
  get gastos() {
    return this.categorias().filter(c => c.type === 'gasto');
  }
  get totalGastos() {
    return this.gastos.reduce((total, categoria) => total + categoria.quantity, 0);
  }
  get totalIngresos() {
    return this.ingresos.reduce((total, categoria) => total + categoria.quantity, 0);
  }
  get saldo() {
    return this.totalIngresos - this.totalGastos;
  }
  agregarCategoriaForm() {
    this.mostrarFormulario = true;
  }
  cancelar() {
    this.mostrarFormulario = false;
  }
  eliminarCategoria(id: number) {
    this.mostrarModalEliminar = true;
    this.categoriaAEliminar = this.categorias().find((c: Savings) => c.id === id);
  }

  confirmarEliminarCategoria() {
  if (this.categoriaAEliminar) {
    const index = this.categorias().findIndex(c => c.id === this.categoriaAEliminar.id);
    if (index > -1) {
      this.subscriptions.push(
        this.ahorrosService.eliminarAhorro(this.categoriaAEliminar.id).subscribe({
          next: (response: HttpResponse<void>) => {
            if (response.success) {
              this.categorias.update((actual) => actual.filter((_, i) => i !== index));
              this.mostrarNotificacion('Eliminado con exito');
            } else {
              this.mostrarNotificacion('No se pudo eliminar');
            }
          },
          error: () => this.mostrarNotificacion('No se pudo eliminar')
        })
      );
    }
  }
  this.mostrarModalEliminar = false;
  this.categoriaAEliminar = null;
}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
 
}
