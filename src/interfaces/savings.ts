export interface Savings {
    id: number,
    name: string,
    tipo: 'gasto' | 'ingreso',
    description?: string,
    quantity: number
}
