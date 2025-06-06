export interface Savings {
    id: number,
    name: string,
    type: 'gasto' | 'ingreso',
    description?: string,
    quantity: number
}
