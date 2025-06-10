
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface UniversalStatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  colorIndex: number; // 0: primary, 1: secondary, 2: info, 3: success
}

const getColorVariant = (index: number) => {
  const variants = ['primary', 'secondary', 'info', 'success'];
  return variants[index % variants.length];
};

export function UniversalStatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  colorIndex 
}: UniversalStatCardProps) {
  const variant = getColorVariant(colorIndex);
  
  return (
    <Card className="theme-card hover:shadow-lg transition-all duration-200 border theme-border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium theme-text-muted">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg theme-bg-${variant}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold theme-text">{value}</div>
        <p className="text-xs theme-text-muted">
          <span className={`font-medium theme-text-${variant}`}>
            {change}
          </span> so với tháng trước
        </p>
      </CardContent>
    </Card>
  );
}
