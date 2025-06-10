
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

const getIconBgClass = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'secondary':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'info':
      return 'bg-cyan-500 hover:bg-cyan-600';
    case 'success':
      return 'bg-green-500 hover:bg-green-600';
    default:
      return 'bg-blue-500 hover:bg-blue-600';
  }
};

const getChangeTextClass = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'text-blue-600 font-medium';
    case 'secondary':
      return 'text-purple-600 font-medium';
    case 'info':
      return 'text-cyan-600 font-medium';
    case 'success':
      return 'text-green-600 font-medium';
    default:
      return 'text-blue-600 font-medium';
  }
};

export function UniversalStatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  colorIndex 
}: UniversalStatCardProps) {
  const variant = getColorVariant(colorIndex);
  const iconBgClass = getIconBgClass(variant);
  const changeTextClass = getChangeTextClass(variant);
  
  return (
    <Card className="theme-card hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconBgClass} transition-colors duration-200`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-xs text-gray-600">
          <span className={changeTextClass}>
            {change}
          </span> so với tháng trước
        </p>
      </CardContent>
    </Card>
  );
}
