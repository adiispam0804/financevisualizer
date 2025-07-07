'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { FinancialInsight } from '@/lib/types';

interface FinancialInsightsProps {
  insights: FinancialInsight[];
}

export function FinancialInsights({ insights }: FinancialInsightsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-red-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No insights available</p>
            <p className="text-gray-400 text-sm mt-2">
              Add more transactions to get personalized insights
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Alert key={index} className="relative">
                <div className={`${getColorClass(insight.type)} absolute left-3 top-3`}>
                  {getIcon(insight.type)}
                </div>
                <div className="ml-8">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    {insight.value && (
                      <span className={`font-bold ${getColorClass(insight.type)}`}>
                        {formatCurrency(insight.value)}
                      </span>
                    )}
                  </div>
                  <AlertDescription className="text-gray-600 mt-1">
                    {insight.message}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}