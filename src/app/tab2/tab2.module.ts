import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { FormComponent } from '../components/form/form.component';
import { OrdenarPipe } from '../pipes/order.pipe';
import { DynamicModalComponent } from '../components/dynamic-modal/dynamic-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    FormComponent,
    OrdenarPipe,
    AsyncPipe,
    DynamicModalComponent
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
