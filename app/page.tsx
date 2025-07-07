'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Settings, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { MonthlyExpensesChart } from '@/components/monthly-expenses-chart';
import { CategoryPieChart } from '@/components/category-pie-chart';
import { BudgetComparisonChart } from '@/components/budget-comparison-chart';
import { DashboardStats } from '@/components/dashboard-stats';
import { BudgetManager } from '@/components/budget-manager';
import { FinancialInsights } from '@/components/financial-insights';
import { Transaction } from '@/lib/types';
import { getTransactions, deleteTransaction, getCategories, getBudgets } from '@/lib/storage';
import { 
  getMonthlyExpenses, 
  getCategoryExpenses,
  getTotalExpenses, 
  getTotalIncome, 
  getCurrentMonthExpenses,
  getCurrentMonthIncome,
  getBudgetComparisons,
  getFinancialInsights
} from '@/lib/analytics';
import { format } from 'date-fns';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedTransactions = getTransactions();
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowAddForm(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowAddForm(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      loadData();
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingTransaction(null);
    loadData();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingTransaction(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const monthlyExpenses = getMonthlyExpenses(transactions);
  const categoryExpenses = getCategoryExpenses(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const totalIncome = getTotalIncome(transactions);
  const currentMonthExpenses = getCurrentMonthExpenses(transactions);
  const currentMonthIncome = getCurrentMonthIncome(transactions);
  const currentMonth = format(new Date(), 'yyyy-MM');
  const budgetComparisons = getBudgetComparisons(transactions, currentMonth);
  const financialInsights = getFinancialInsights(transactions);
  const categories = getCategories();
  const budgets = getBudgets();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-blue-600" />
            Personal Finance Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Track your expenses, manage budgets, and gain financial insights
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button onClick={handleAddTransaction} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                </DialogTitle>
              </DialogHeader>
              <TransactionForm
                transaction={editingTransaction || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              currentMonthExpenses={currentMonthExpenses}
              currentMonthIncome={currentMonthIncome}
              transactionCount={transactions.length}
              categoryCount={categories.length}
              budgetCount={budgets.filter(b => b.month === currentMonth).length}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyExpensesChart data={monthlyExpenses} />
              <CategoryPieChart data={categoryExpenses} />
            </div>
            
            {budgetComparisons.length > 0 && (
              <BudgetComparisonChart data={budgetComparisons} />
            )}
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyExpensesChart data={monthlyExpenses} />
              <CategoryPieChart data={categoryExpenses} />
            </div>
            
            {budgetComparisons.length > 0 && (
              <BudgetComparisonChart data={budgetComparisons} />
            )}
          </TabsContent>

          <TabsContent value="budgets">
            <BudgetManager onBudgetChange={loadData} />
          </TabsContent>

          <TabsContent value="insights">
            <FinancialInsights insights={financialInsights} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}