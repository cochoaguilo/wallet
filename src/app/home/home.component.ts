import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DeudasService } from '../services/deudas.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { AhorrosService } from '../services/ahorros.service';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonicModule, CurrencyPipe, AsyncPipe] 
})
export class HomeComponent  implements OnInit {

  totalInversiones = 0;
  private deudasService = inject(DeudasService);
  private ahorrosService = inject(AhorrosService);
  public ahorrosTotales$: Observable<number> = of(0);
  public deudasTotales$: Observable<number> = of(0);

  constructor() { }

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem("USER") || "{}");
    console.log('Usuario actual:', user);
    const userId = user.id;
    this.ahorrosTotales$ = this.ahorrosService.getAhorrosTotales(userId).pipe(
      map((response) => response.data ?? 0)
    );
    this.deudasTotales$ = this.deudasService.getTotalDeudas(userId).pipe(
      map((response) => response.data ?? 0)
    );
    this.totalInversiones = 320
  }

}
