import { Pipe, PipeTransform } from '@angular/core';
import { Investments } from 'src/interfaces/investments';

@Pipe({
  name: 'ordenar',
  standalone: true
})
export class OrdenarPipe implements PipeTransform {

  transform(items: Investments[], criterio: string): any[] {
    if (!items) return [];
    switch (criterio) {
      case 'mayorPrecio':
        return [...items].sort((a, b) => b.price - a.price);
      case 'menorPrecio':
        return [...items].sort((a, b) => a.price - b.price);
      case 'mayorTenencia':
        return [...items].sort((a, b) => (b.hold || 0) - (a.hold || 0));
      case 'menorTenencia':
        return [...items].sort((a, b) => (a.hold || 0) - (b.hold || 0));
      case 'mayorValor':
        return [...items].sort((a, b) =>
          ((b.hold || 0) * b.price) -
          ((a.hold || 0) * a.price)
        );
      case 'menorValor':
        return [...items].sort((a, b) =>
          ((a.hold || 0) * a.price) -
          ((b.hold || 0) * (b.price || b.price))
        );
      case 'plataform':
        return [...items].sort((a, b) => (a.platform).localeCompare(b.platform));
      case 'nombre':
        return [...items].sort((a, b) => (a.name || a.symbol).localeCompare(b.name || b.symbol));
      default:
        return items;
    }
  }

}
