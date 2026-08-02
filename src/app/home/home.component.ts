import { Component, inject, OnInit, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DeudasService } from '../services/deudas.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { AhorrosService } from '../services/ahorros.service';
import { map, Observable, of, take } from 'rxjs';
import { InversionesService } from '../services/inversiones.service';
import { Cotizaciones } from 'src/interfaces/cotizaciones';
import { SlideItem, SlidesComponent } from '../components/slides/slides.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonicModule, CurrencyPipe, AsyncPipe, SlidesComponent] 
})
export class HomeComponent  implements OnInit {

  totalInversiones = 0;
  private deudasService = inject(DeudasService);
  private ahorrosService = inject(AhorrosService);
  private inversionesService = inject(InversionesService);
  public slides = signal<SlideItem[]>([])
  public ahorrosTotales$: Observable<number> = of(0);
  public deudasTotales$: Observable<number> = of(0);

  constructor() { }

  ngOnInit() {
    this.inversionesService.getCotizacionesDolares().pipe(
      take(1)
    ).subscribe(data => {
      if (!data.success) return;
      //por el momento solo guardo la info del dolar bolsa/MEP
      this.slides.update(sl => sl = data.data.map(dt =>{
        return {
          title: dt.name,
          description: `Compra: ${dt.buy} Venta: ${dt.sell}
          `
        }
      }))
      
      const dolarMEP  = data.data.find((dol:Cotizaciones) => dol.origin == "BOLSA");
      sessionStorage.setItem("dolarMEP", JSON.stringify(dolarMEP))
    })
    const user = JSON.parse(sessionStorage.getItem("USER") || "{}");
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
