import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { FormComponent } from '../components/form/form.component';
import { DynamicModalComponent } from '../components/dynamic-modal/dynamic-modal.component';
import { NotificationComponent } from '../components/notification/notification.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    FormComponent,
    DynamicModalComponent,
    NotificationComponent
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
