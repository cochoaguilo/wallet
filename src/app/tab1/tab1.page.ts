import { Component } from '@angular/core';
import { Savings } from 'src/interfaces/savings';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  constructor() {}

  public categorias: Savings[] = [
    { id: 0, tipo:'gasto', name: 'Alimentación', quantity: 250 },
    { id: 1, tipo: 'gasto', name: 'Transporte', quantity: 100 },
    { id: 2, tipo: 'gasto',name: 'Entretenimiento', quantity: 80 },
    { id: 3, tipo: 'ingreso', name: 'Sueldo', quantity: 1200 }
  ];

  mostrarFormulario = false;

  formFields = [
  { name: 'tipo', label: 'Tipo', type: 'select', required: true, options: [
    { label: 'Gasto', value: 'gasto' },
    { label: 'Ingreso', value: 'ingreso' }
  ]},
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'quantity', label: 'Cantidad', type: 'number', required: true }
];

  agregarCategoria(data: Savings) {
    this.categorias.push({
    id: this.categorias.length,
    tipo: data.tipo,
    name: data.name,
    quantity: Number(data.quantity)
  });
  this.mostrarFormulario = false;
  }

  get ingresos() {
    return this.categorias.filter(c => c.tipo === 'ingreso');
  }
  get gastos() {
    return this.categorias.filter(c => c.tipo === 'gasto');
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
