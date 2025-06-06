import { Component, OnInit } from '@angular/core';
import { Savings } from 'src/interfaces/savings';
import { AhorrosService } from '../services/ahorros.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor(
    public ahorrosService: AhorrosService
  ) {}

  public categorias: Savings[] = [];

  mostrarFormulario = false;

  formFields = [
  { name: 'type', label: 'Tipo', type: 'select', required: true, options: [
    { label: 'Gasto', value: 'gasto' },
    { label: 'Ingreso', value: 'ingreso' }
  ]},
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'quantity', label: 'Cantidad', type: 'number', required: true }
];

ngOnInit(): void {
  this.ahorrosService.getAhorros().subscribe((data: Savings[]) => {
    this.categorias = data;
  });
}

  agregarCategoria(data: Savings) {
    this.categorias.push({
    ...data,
    id: this.categorias.length,
  });
  this.ahorrosService.agregarAhorro(data)
  .subscribe();
  this.mostrarFormulario = false;
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
    this.categorias = this.categorias.filter(c => c.id !== id);
  }
 
}
