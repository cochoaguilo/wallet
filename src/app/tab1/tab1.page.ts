import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Savings } from 'src/interfaces/savings';
import { AhorrosService } from '../services/ahorros.service';
import { FormComponent } from '../components/form/form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  @ViewChild(FormComponent) formComponent!: FormComponent;
  constructor(
    public ahorrosService: AhorrosService
  ) {}

  public categorias: Savings[] = [];

  mostrarFormulario = false;
  editarIndex: number | null = null;
  editarId: number  | null = null;
  private subscriptions: Subscription[] = [];
  mostrarModalEliminar = false;
  categoriaAEliminar: any = null;

  formFields = [
  { name: 'type', label: 'Tipo', type: 'select', required: true, options: [
    { label: 'Gasto', value: 'gasto' },
    { label: 'Ingreso', value: 'ingreso' }
  ]},
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'quantity', label: 'Cantidad', type: 'number', required: true }
];

ngOnInit(): void {
  this.subscriptions.push(
    this.ahorrosService.getAhorros().subscribe((data: Savings[]) => {
      this.categorias = data;
    })
  )
}

  agregarModificarCategoria(data: Savings) {
    console.log(data,this.editarId);
    
    if (this.editarIndex) {
      this.subscriptions.push(
        this.ahorrosService.actualizarAhorro(data, this.editarId)
      .subscribe()
      );
      this.categorias.splice(this.editarIndex,1,data);
      this.editarIndex = null
    } else {
      this.categorias.push({
      ...data,
      id: this.categorias.length,
      });
      this.subscriptions.push(
        this.ahorrosService.agregarAhorro(data)
      .subscribe()
      )
      
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
    return this.categorias.filter(c => c.type === 'ingreso');
  }
  get gastos() {
    return this.categorias.filter(c => c.type === 'gasto');
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
    this.categoriaAEliminar = this.categorias.find(c => c.id === id);
  }

  confirmarEliminarCategoria() {
  if (this.categoriaAEliminar) {
    const index = this.categorias.findIndex(c => c.id === this.categoriaAEliminar.id);
    if (index > -1) {
      this.categorias.splice(index, 1);
      this.subscriptions.push(
      this.ahorrosService.eliminarAhorro(this.categoriaAEliminar.id)
      .subscribe())
    }
  }
  this.mostrarModalEliminar = false;
  this.categoriaAEliminar = null;
}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
 
}
