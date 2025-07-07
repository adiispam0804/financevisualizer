'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetComparison } from '@/lib/types';

interface BudgetComparisonChartProps {
  data: BudgetComparison[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: BudgetComparison;
  }>;
  label?: string;
}

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const budgeted = payload[0].value;
      const actual = payload[1].value;
      const difference = actual - budgeted;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Budgeted: {formatCurrency(budgeted)}
          </p>
          <p className="text-green-600">
            Actual: {formatCurrency(actual)}
          </p>
          <p className={`${difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
            Difference: {difference > 0 ? '+' : ''}{formatCurrency(difference)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">No budget data available</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="categoryName"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="budgeted" 
                  fill="#3b82f6"
                  name="Budgeted"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="actual" 
                  fill="#ef4444"
                  name="Actual"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}