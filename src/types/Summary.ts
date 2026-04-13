export interface PersonTotals {
  id: string
  name: string
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface Summary {
  persons: PersonTotals[]
  totalIncome: number
  totalExpense: number
  balance: number
}