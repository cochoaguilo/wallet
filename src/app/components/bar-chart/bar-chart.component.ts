import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Savings } from 'src/interfaces/savings';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  imports: [BaseChartDirective],
  standalone: true
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() categorias: Savings[] = [];
  @Input() chartType: 'bar' | 'doughnut' = 'bar';

  public chart: any;
  constructor() { }

 ngOnInit(): void {
   this.createChart();
 }

 ngOnChanges(changes: SimpleChanges): void {
    if (changes['categorias'] || changes['chartType']) {
      this.createChart();
    }
  }

  createChart(){
  let backgroundColors: string[] = [];
  if (this.chartType === 'bar') {
    backgroundColors = this.categorias.map(c => c.tipo === 'ingreso' ? '#2dd36f' : '#eb445a');
  } else {
    // Colores pastel para doughnut
    backgroundColors = [
      '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#2dd36f', '#eb445a'
    ];
    // Repetir colores si hay más categorías
    backgroundColors = this.categorias.map((_, i) => backgroundColors[i % backgroundColors.length]);
  }
    this.chart =  {
      type: this.chartType,

      data: {// values on X-Axis
        labels: this.categorias.map(c => c.name), 
        datasets: [
          {
            label: "Cantidad",
            data: this.categorias.map(c => c.quantity),
            backgroundColor: backgroundColors
          },
        ]
      },
      options: {
        aspectRatio:2.5
      }

    };
    
  }
}
