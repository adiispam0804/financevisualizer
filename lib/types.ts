export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // Format: YYYY-MM
  createdAt: string;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
  count: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  count: number;
  color: string;
}

export interface BudgetComparison {
  categoryId: string;
  categoryName: string;
  budgeted: number;
  actual: number;
  percentage: number;
  status: 'under' | 'over' | 'on-track';
  color: string;
}

export interface FinancialInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  value?: number;
}