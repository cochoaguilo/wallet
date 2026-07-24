export interface Investments {
    tipo: 'cripto' | 'accion',
    symbol: string,
    name:string,
    hold: number,
    platform: string,
    fecha: Date,
    id: number,
    moneda: string,
    price: number
}
