import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    data: { vista: 'ambos' },
  },
  {
    path: 'acciones',
    component: Tab2Page,
    data: { vista: 'acciones' },
  },
  {
    path: 'criptomonedas',
    component: Tab2Page,
    data: { vista: 'criptomonedas' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
