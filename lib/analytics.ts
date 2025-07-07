import { Transaction, MonthlyExpense, CategoryExpense, BudgetComparison, FinancialInsight } from './types';
import { getCategories, getBudgets, getCategoryById } from './storage';
import { format, parseISO, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export const getMonthlyExpenses = (transactions: Transaction[]): MonthlyExpense[] => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const monthlyData: Record<string, { amount: number; count: number }> = {};
  
  expenseTransactions.forEach(transaction => {
    const month = format(parseISO(transaction.date), 'MMM yyyy');
    
    if (!monthlyData[month]) {
      monthlyData[month] = { amount: 0, count: 0 };
    }
    
    monthlyData[month].amount += transaction.amount;
    monthlyData[month].count += 1;
  });
  
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-12); // Last 12 months
};

export const getCategoryExpenses = (transactions: Transaction[]): CategoryExpense[] => {
  const categories = getCategories();
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryData: Record<string, { amount: number; count: number }> = {};
  
  expenseTransactions.forEach(transaction => {
    const categoryId = transaction.category;
    
    if (!categoryData[categoryId]) {
      categoryData[categoryId] = { amount: 0, count: 0 };
    }
    
    categoryData[categoryId].amount += transaction.amount;
    categoryData[categoryId].count += 1;
  });
  
  return Object.entries(categoryData)
    .map(([categoryId, data]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        category: category?.name || 'Unknown',
        amount: data.amount,
        count: data.count,
        color: category?.color || '#6b7280',
      };
    })
    .sort((a, b) => b.amount - a.amount);
};

export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getCurrentMonthExpenses = (transactions: Transaction[]): number => {
  const now = new Date();
  return transactions
    .filter(t => t.type === 'expense' && isSameMonth(parseISO(t.date), now))
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getCurrentMonthIncome = (transactions: Transaction[]): number => {
  const now = new Date();
  return transactions
    .filter(t => t.type === 'income' && isSameMonth(parseISO(t.date), now))
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getBudgetComparisons = (transactions: Transaction[], month: string): BudgetComparison[] => {
  const budgets = getBudgets();
  const categories = getCategories();
  const monthBudgets = budgets.filter(b => b.month === month);
  
  return monthBudgets.map(budget => {
    const category = categories.find(c => c.id === budget.categoryId);
    const actualExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.categoryId && 
        format(parseISO(t.date), 'yyyy-MM') === month
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = budget.amount > 0 ? (actualExpenses / budget.amount) * 100 : 0;
    let status: 'under' | 'over' | 'on-track' = 'on-track';
    
    if (percentage > 100) {
      status = 'over';
    } else if (percentage < 80) {
      status = 'under';
    }
    
    return {
      categoryId: budget.categoryId,
      categoryName: category?.name || 'Unknown',
      budgeted: budget.amount,
      actual: actualExpenses,
      percentage,
      status,
      color: category?.color || '#6b7280',
    };
  });
};

export const getFinancialInsights = (transactions: Transaction[]): FinancialInsight[] => {
  const insights: FinancialInsight[] = [];
  const currentMonth = format(new Date(), 'yyyy-MM');
  
  // Current month analysis
  const currentMonthExpenses = getCurrentMonthExpenses(transactions);
  const currentMonthIncome = getCurrentMonthIncome(transactions);
  const balance = currentMonthIncome - currentMonthExpenses;
  
  if (balance < 0) {
    insights.push({
      type: 'warning',
      title: 'Monthly Deficit',
      message: 'You\'re spending more than you earn this month',
      value: Math.abs(balance),
    });
  } else if (balance > 0) {
    insights.push({
      type: 'success',
      title: 'Monthly Surplus',
      message: 'Great job! You\'re saving money this month',
      value: balance,
    });
  }
  
  // Category insights
  const categoryExpenses = getCategoryExpenses(transactions);
  if (categoryExpenses.length > 0) {
    const topCategory = categoryExpenses[0];
    const totalExpenses = categoryExpenses.reduce((sum, c) => sum + c.amount, 0);
    const percentage = (topCategory.amount / totalExpenses) * 100;
    
    if (percentage > 40) {
      insights.push({
        type: 'warning',
        title: 'High Category Spending',
        message: `${topCategory.category} accounts for ${percentage.toFixed(1)}% of your expenses`,
        value: topCategory.amount,
      });
    }
  }
  
  // Budget insights
  const budgetComparisons = getBudgetComparisons(transactions, currentMonth);
  const overBudgetCategories = budgetComparisons.filter(b => b.status === 'over');
  
  if (overBudgetCategories.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Over Budget',
      message: `You're over budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? 'category' : 'categories'}`,
    });
  }
  
  // Spending trend
  const monthlyExpenses = getMonthlyExpenses(transactions);
  if (monthlyExpenses.length >= 2) {
    const lastMonth = monthlyExpenses[monthlyExpenses.length - 1];
    const previousMonth = monthlyExpenses[monthlyExpenses.length - 2];
    const change = lastMonth.amount - previousMonth.amount;
    const changePercentage = (change / previousMonth.amount) * 100;
    
    if (changePercentage > 20) {
      insights.push({
        type: 'warning',
        title: 'Spending Increase',
        message: `Your spending increased by ${changePercentage.toFixed(1)}% from last month`,
        value: change,
      });
    } else if (changePercentage < -20) {
      insights.push({
        type: 'success',
        title: 'Spending Decrease',
        message: `Great! Your spending decreased by ${Math.abs(changePercentage).toFixed(1)}% from last month`,
        value: Math.abs(change),
      });
    }
  }
  
  return insights;
};

export const getRecentTransactions = (transactions: Transaction[], count: number = 5): Transaction[] => {
  return transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};