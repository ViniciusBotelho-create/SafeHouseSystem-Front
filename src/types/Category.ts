export const CategoryFinality = {
  Expense: 0,
  Income: 1,
  Both: 2,
} as const;

export type CategoryFinality =
  (typeof CategoryFinality)[keyof typeof CategoryFinality];

export interface Category {
  id: string;
  description: string;
  finality: CategoryFinality;
}

export interface CreateCategoryDto {
  description: string;
  finality: CategoryFinality;
}