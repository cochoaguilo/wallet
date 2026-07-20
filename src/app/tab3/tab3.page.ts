import { Component, inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { DeudasService } from '../services/deudas.service';
import { Subscription } from 'rxjs';
import { Forms } from 'src/interfaces/forms';
import { Deudas } from 'src/interfaces/deudas';
import { HttpResponse } from 'src/interfaces/http-response';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class Tab3Page implements OnInit, OnDestroy {

  mostrarFormulario = false;
  mostrarModalEliminar = false;
  deudaAEliminar: any = null;
  private userId:number;
  public deudas= signal<Deudas[]>([]);
  private deudasService = inject(DeudasService);

  formFields: Forms[] = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'text', required: false },
    { name: 'amount', label: 'Monto', type: 'number', required: true },
  ];
  editarIndex: number | undefined;
  editarId: any;
  formComponent: any;
  subscriptions: Subscription[] = [];

  constructor() {
    const user = JSON.parse(sessionStorage.getItem("USER") || "{}");
    this.userId = user.id;
  }

  ngOnInit(): void {
    
    this.subscriptions.push(
        this.deudasService.getDeudas(this.userId).subscribe((data: HttpResponse< Deudas[]>) => {
          if (data.success) {
            this.deudas.set(data.data as Deudas[]);
          }
        })
      )
  }


  agregarDeuda(deuda: any) {
    this.subscriptions.push(
    this.deudasService.agregarDeuda(deuda, this.userId).subscribe((data: HttpResponse<Deudas>) => {
      const nuevaDeuda = data.data ?? deuda;
      this.deudas.update(deudasActuales => [...deudasActuales, nuevaDeuda]);
    })
    )
    this.mostrarFormulario = false;
  }
  editarDeuda(deuda: any, index: number) {
    this.editarIndex = index;
    this.mostrarFormulario = true;
    this.editarId = deuda.id;
    
    // Rellena el formulario con los datos de la categoría seleccionada
    /* setTimeout(() => {
        if (this.formComponent && this.formComponent.categoriaForm) {
          this.formFields.forEach(field => {
            if (this.formComponent.categoriaForm.get(field.name)) {
              const key = field.name as keyof any;
              this.formComponent.categoriaForm.get(field.name)?.setValue(deuda[key]);
            }
          });
        }
      }); */
  }
  eliminarDeuda(deuda: any) {
  this.deudaAEliminar = deuda;
  this.mostrarModalEliminar = true;
  }
  confirmarEliminarDeuda() {
  if (this.deudaAEliminar) {
    const index = this.deudas().findIndex(d => d === this.deudaAEliminar);
    if (index > -1) {
      this.deudas.update((actual) => actual.filter((_, i) => i !== index));
      this.subscriptions.push(
        this.deudasService.eliminarDeuda(this.deudaAEliminar.id).subscribe()
      );
      
    }
  }
  this.mostrarModalEliminar = false;
  this.deudaAEliminar = null;
}

ngOnDestroy(): void {
  this.subscriptions.forEach(sub => sub.unsubscribe())
}

}
