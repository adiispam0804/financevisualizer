'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Target, PieChart } from 'lucide-react';

interface DashboardStatsProps {
  totalIncome: number;
  totalExpenses: number;
  currentMonthExpenses: number;
  currentMonthIncome: number;
  transactionCount: number;
  categoryCount: number;
  budgetCount: number;
}

export function DashboardStats({ 
  totalIncome, 
  totalExpenses, 
  currentMonthExpenses, 
  currentMonthIncome,
  transactionCount,
  categoryCount,
  budgetCount
}: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const balance = totalIncome - totalExpenses;
  const monthlyBalance = currentMonthIncome - currentMonthExpenses;

  const stats = [
    {
      title: 'Total Balance',
      value: formatCurrency(balance),
      icon: DollarSign,
      color: balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: balance >= 0 ? 'bg-green-50' : 'bg-red-50',
      description: balance >= 0 ? 'Positive balance' : 'Negative balance',
    },
    {
      title: 'Monthly Balance',
      value: formatCurrency(monthlyBalance),
      icon: Calendar,
      color: monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: monthlyBalance >= 0 ? 'bg-green-50' : 'bg-red-50',
      description: monthlyBalance >= 0 ? 'Monthly surplus' : 'Monthly deficit',
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${transactionCount} total transactions`,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: `${categoryCount} categories tracked`,
    },
    {
      title: 'This Month Income',
      value: formatCurrency(currentMonthIncome),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Current month income',
    },
    {
      title: 'This Month Expenses',
      value: formatCurrency(currentMonthExpenses),
      icon: TrendingDown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Current month expenses',
    },
    {
      title: 'Active Budgets',
      value: budgetCount.toString(),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Budgets this month',
    },
    {
      title: 'Categories',
      value: categoryCount.toString(),
      icon: PieChart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Available categories',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}