import { Component } from '@angular/core';
import { DeudasService } from '../services/deudas.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  mostrarFormulario = false;

  formFields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'text', required: false },
    { name: 'monto', label: 'Monto', type: 'number', required: true },
    { name: 'fecha', label: 'Fecha', type: 'date', required: true },
    { name: 'interes', label: 'Porcentaje de interés', type: 'number', required: true },
    {
      name: 'tipoInteres',
      label: 'Tipo de interés',
      type: 'select',
      required: true,
      options: [
        { label: 'Anual', value: 'anual' },
        { label: 'Mensual', value: 'mensual' }
      ]
    }
  ];

  constructor(private deudasService: DeudasService) {
    this.deudasService.deudas$.subscribe(deudas => this.deudas = deudas);
  }

  deudas: any[] = [];

  agregarDeuda(deuda: any) {
    this.deudasService.agregarDeuda(deuda);
    this.mostrarFormulario = false;
  }

}
