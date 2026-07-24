import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { FormComponent } from '../components/form/form.component';
import { DynamicModalComponent } from '../components/dynamic-modal/dynamic-modal.component';
import { NotificationComponent } from '../components/notification/notification.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    BarChartComponent,
    FormComponent,
    DynamicModalComponent,
    NotificationComponent
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
