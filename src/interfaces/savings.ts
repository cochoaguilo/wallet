export interface Savings {
    id: number,
    name: string,
    type: 'gasto' | 'ingreso',
    description: string,
    date: Date,
    quantity: number
}
