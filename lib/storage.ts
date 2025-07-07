import { Transaction, Category, Budget } from './types';

const TRANSACTIONS_KEY = 'personal-finance-transactions';
const CATEGORIES_KEY = 'personal-finance-categories';
const BUDGETS_KEY = 'personal-finance-budgets';

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  // Expense categories
  { id: '1', name: 'Food & Dining', type: 'expense', color: '#ef4444', icon: '🍽️' },
  { id: '2', name: 'Transportation', type: 'expense', color: '#f97316', icon: '🚗' },
  { id: '3', name: 'Shopping', type: 'expense', color: '#eab308', icon: '🛍️' },
  { id: '4', name: 'Entertainment', type: 'expense', color: '#22c55e', icon: '🎬' },
  { id: '5', name: 'Bills & Utilities', type: 'expense', color: '#3b82f6', icon: '💡' },
  { id: '6', name: 'Healthcare', type: 'expense', color: '#8b5cf6', icon: '🏥' },
  { id: '7', name: 'Education', type: 'expense', color: '#06b6d4', icon: '📚' },
  { id: '8', name: 'Travel', type: 'expense', color: '#f59e0b', icon: '✈️' },
  { id: '9', name: 'Other Expenses', type: 'expense', color: '#6b7280', icon: '💰' },
  
  // Income categories
  { id: '10', name: 'Salary', type: 'income', color: '#10b981', icon: '💼' },
  { id: '11', name: 'Freelance', type: 'income', color: '#059669', icon: '💻' },
  { id: '12', name: 'Investments', type: 'income', color: '#0d9488', icon: '📈' },
  { id: '13', name: 'Other Income', type: 'income', color: '#14b8a6', icon: '💎' },
];

// Transactions
export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  const transactions = getTransactions();
  transactions.unshift(newTransaction);
  saveTransactions(transactions);
  
  return newTransaction;
};

export const updateTransaction = (id: string, updates: Partial<Transaction>): Transaction | null => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  transactions[index] = { ...transactions[index], ...updates };
  saveTransactions(transactions);
  
  return transactions[index];
};

export const deleteTransaction = (id: string): boolean => {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  
  if (filtered.length === transactions.length) return false;
  
  saveTransactions(filtered);
  return true;
};

// Categories
export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (!stored) {
      // Initialize with default categories
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading categories:', error);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};

export const getCategoryById = (id: string): Category | null => {
  const categories = getCategories();
  return categories.find(c => c.id === id) || null;
};

// Budgets
export const getBudgets = (): Budget[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(BUDGETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading budgets:', error);
    return [];
  }
};

export const saveBudgets = (budgets: Budget[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving budgets:', error);
  }
};

export const addBudget = (budget: Omit<Budget, 'id' | 'createdAt'>): Budget => {
  const newBudget: Budget = {
    ...budget,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  const budgets = getBudgets();
  // Remove existing budget for same category and month
  const filtered = budgets.filter(b => !(b.categoryId === budget.categoryId && b.month === budget.month));
  filtered.push(newBudget);
  saveBudgets(filtered);
  
  return newBudget;
};

export const updateBudget = (id: string, updates: Partial<Budget>): Budget | null => {
  const budgets = getBudgets();
  const index = budgets.findIndex(b => b.id === id);
  
  if (index === -1) return null;
  
  budgets[index] = { ...budgets[index], ...updates };
  saveBudgets(budgets);
  
  return budgets[index];
};

export const deleteBudget = (id: string): boolean => {
  const budgets = getBudgets();
  const filtered = budgets.filter(b => b.id !== id);
  
  if (filtered.length === budgets.length) return false;
  
  saveBudgets(filtered);
  return true;
};

export const getBudgetForCategoryAndMonth = (categoryId: string, month: string): Budget | null => {
  const budgets = getBudgets();
  return budgets.find(b => b.categoryId === categoryId && b.month === month) || null;
};