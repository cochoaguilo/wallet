import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenar',
  standalone: true
})
export class OrdenarPipe implements PipeTransform {

  transform(items: any[], criterio: string, holdings: any): any[] {
    if (!items) return [];
    switch (criterio) {
      case 'mayorPrecio':
        return [...items].sort((a, b) => (b.current_price || b.price) - (a.current_price || a.price));
      case 'menorPrecio':
        return [...items].sort((a, b) => (a.current_price || a.price) - (b.current_price || b.price));
      case 'mayorTenencia':
        return [...items].sort((a, b) => (holdings[b.symbol] || 0) - (holdings[a.symbol] || 0));
      case 'menorTenencia':
        return [...items].sort((a, b) => (holdings[a.symbol] || 0) - (holdings[b.symbol] || 0));
      case 'mayorValor':
        return [...items].sort((a, b) =>
          ((holdings[b.symbol] || 0) * (b.current_price || b.price)) -
          ((holdings[a.symbol] || 0) * (a.current_price || a.price))
        );
      case 'menorValor':
        return [...items].sort((a, b) =>
          ((holdings[a.symbol] || 0) * (a.current_price || a.price)) -
          ((holdings[b.symbol] || 0) * (b.current_price || b.price))
        );
      case 'nombre':
        return [...items].sort((a, b) => (a.name || a.symbol).localeCompare(b.name || b.symbol));
      default:
        return items;
    }
  }

}
