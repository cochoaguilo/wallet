export interface Investments {
    tipo: 'cripto' | 'accion',
    symbol: string,
    name:string,
    holdings: number,
    plataforma: string,
    fecha: Date,
    id: number,
    moneda: string
}
