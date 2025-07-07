'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Budget, Category } from '@/lib/types';
import { getBudgets, addBudget, updateBudget, deleteBudget, getCategories, getBudgetForCategoryAndMonth } from '@/lib/storage';

interface BudgetManagerProps {
  onBudgetChange: () => void;
}

export function BudgetManager({ onBudgetChange }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    month: format(new Date(), 'yyyy-MM'),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBudgets(getBudgets());
    setCategories(getCategories().filter(c => c.type === 'expense'));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    
    if (!formData.month) {
      newErrors.month = 'Please select a month';
    }
    
    // Check if budget already exists for this category and month
    if (!editingBudget && getBudgetForCategoryAndMonth(formData.categoryId, formData.month)) {
      newErrors.categoryId = 'Budget already exists for this category and month';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const budgetData = {
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      month: formData.month,
    };
    
    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
    } else {
      addBudget(budgetData);
    }
    
    resetForm();
    loadData();
    onBudgetChange();
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      month: budget.month,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
      loadData();
      onBudgetChange();
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      amount: '',
      month: format(new Date(), 'yyyy-MM'),
    });
    setEditingBudget(null);
    setShowAddForm(false);
    setErrors({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? `${category.icon} ${category.name}` : 'Unknown Category';
  };

  const filteredBudgets = budgets.filter(b => b.month === selectedMonth);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6" />
            Budget Manager
          </CardTitle>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? 'Edit Budget' : 'Add New Budget'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className={errors.amount ? 'border-red-500' : ''}
                  />
                  {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                    className={errors.month ? 'border-red-500' : ''}
                  />
                  {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingBudget ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <Label htmlFor="month-filter">Filter by Month:</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthValue = format(date, 'yyyy-MM');
                const monthLabel = format(date, 'MMMM yyyy');
                return (
                  <SelectItem key={monthValue} value={monthValue}>
                    {monthLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredBudgets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No budgets set for {format(new Date(selectedMonth), 'MMMM yyyy')}</p>
            <p className="text-gray-400 text-sm mt-2">
              Add your first budget to start tracking your spending goals
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBudgets.map((budget) => (
              <div
                key={budget.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900">
                      {getCategoryName(budget.categoryId)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(budget.month), 'MMMM yyyy')}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {formatCurrency(budget.amount)}
                  </p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(budget)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(budget.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}