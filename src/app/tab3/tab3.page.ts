import { Component, OnInit } from '@angular/core';
import { DeudasService } from '../services/deudas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  mostrarFormulario = false;
  mostrarModalEliminar = false;
  deudaAEliminar: any = null;

  formFields = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'text', required: false },
    { name: 'amount', label: 'Monto', type: 'number', required: true },
    /* { name: 'fecha', label: 'Fecha', type: 'date', required: false },
    { name: 'interes', label: 'Porcentaje de interés', type: 'number', required: false },
    {
      name: 'tipoInteres',
      label: 'Tipo de interés',
      type: 'select',
      required: false,
      options: [
        { label: 'Anual', value: 'anual' },
        { label: 'Mensual', value: 'mensual' }
      ]
    } */
  ];
  editarIndex: number | undefined;
  editarId: any;
  formComponent: any;
  subscriptions: Subscription[] = [];

  constructor(private deudasService: DeudasService) {
    this.deudasService.deudas$.subscribe(deudas => this.deudas = deudas);
  }

  ngOnInit(): void {
    this.subscriptions.push(
        this.deudasService.getDeudas().subscribe((data: any[]) => {
          this.deudas = data;
        })
      )
  }

  deudas: any[] = [];

  agregarDeuda(deuda: any) {
    this.deudasService.agregarDeuda(deuda).subscribe();
    this.mostrarFormulario = false;
  }
  editarDeuda(deuda: any, index: number) {
    this.editarIndex = index;
    this.mostrarFormulario = true;
    this.editarId = deuda.id;
    
    // Rellena el formulario con los datos de la categoría seleccionada
    setTimeout(() => {
        if (this.formComponent && this.formComponent.categoriaForm) {
          this.formFields.forEach(field => {
            if (this.formComponent.categoriaForm.get(field.name)) {
              const key = field.name as keyof any;
              this.formComponent.categoriaForm.get(field.name)?.setValue(deuda[key]);
            }
          });
        }
      });
  }
  eliminarDeuda(deuda: any) {
  this.deudaAEliminar = deuda;
  this.mostrarModalEliminar = true;
  }
  confirmarEliminarDeuda() {
  if (this.deudaAEliminar) {
    const index = this.deudas.findIndex(d => d === this.deudaAEliminar);
    if (index > -1) {
      this.deudas.splice(index, 1);
      this.deudasService.eliminarDeuda(this.deudaAEliminar.id).subscribe();
    }
  }
  this.mostrarModalEliminar = false;
  this.deudaAEliminar = null;
}

}
