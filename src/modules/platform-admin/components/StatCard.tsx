
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'down' | 'neutral';
  colorIndex?: number; // Optional color index for preset theming
}

export function StatCard({ title, value, change, icon: Icon, trend, colorIndex = 0 }: StatCardProps) {
  const getColorVariant = (index: number) => {
    const variants = ['primary', 'secondary', 'info', 'success'];
    return variants[index % variants.length];
  };

  const variant = getColorVariant(colorIndex);

  return (
    <Card className="theme-card hover:shadow-lg transition-all duration-200 border theme-border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg theme-bg-${variant}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium theme-text-muted">{title}</p>
              <p className="text-2xl font-bold theme-text">{value}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-1">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
          <span className={cn(
            "text-sm",
            trend === 'up' && "text-green-600",
            trend === 'down' && "text-red-600", 
            trend === 'neutral' && "theme-text-muted"
          )}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
