import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DeudasService } from '../services/deudas.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonicModule, CurrencyPipe] 
})
export class HomeComponent  implements OnInit {

  totalAhorros = 0;
  totalInversiones = 0;
  totalDeudas = 0;

  constructor(private deudasService: DeudasService) { }

  ngOnInit() {
    this.totalAhorros = 1500;
    this.totalInversiones = 320
    this.totalDeudas = this.deudasService.getTotalDeudas();
  }

}
