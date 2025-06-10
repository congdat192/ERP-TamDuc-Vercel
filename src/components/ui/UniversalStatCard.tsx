
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface UniversalStatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  colorIndex: number; // 0: primary, 1: secondary, 2: info, 3: success
}

const getCardStyles = (index: number) => {
  switch (index % 4) {
    case 0: // Primary color from preset
      return {
        iconBg: 'hsl(var(--voucher-primary-500))',
        iconHover: 'hsl(var(--voucher-primary-600))',
        changeText: 'hsl(var(--voucher-primary-600))'
      };
    case 1: // Secondary color from preset
      return {
        iconBg: 'hsl(var(--voucher-secondary-500))',
        iconHover: 'hsl(var(--voucher-secondary-600))',
        changeText: 'hsl(var(--voucher-secondary-600))'
      };
    case 2: // Info color (fixed semantic color)
      return {
        iconBg: 'hsl(var(--berry-info-500))',
        iconHover: 'hsl(var(--berry-info-600))',
        changeText: 'hsl(var(--berry-info-600))'
      };
    case 3: // Success color (fixed semantic color)
      return {
        iconBg: 'hsl(var(--berry-success-500))',
        iconHover: 'hsl(var(--berry-success-600))',
        changeText: 'hsl(var(--berry-success-600))'
      };
    default:
      return {
        iconBg: 'hsl(var(--voucher-primary-500))',
        iconHover: 'hsl(var(--voucher-primary-600))',
        changeText: 'hsl(var(--voucher-primary-600))'
      };
  }
};

export function UniversalStatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  colorIndex 
}: UniversalStatCardProps) {
  const styles = getCardStyles(colorIndex);
  
  return (
    <Card className="theme-card hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div 
          className="p-2 rounded-lg transition-colors duration-200 group cursor-pointer"
          style={{ 
            backgroundColor: styles.iconBg,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = styles.iconHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = styles.iconBg;
          }}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-xs text-gray-600">
          <span 
            className="font-medium"
            style={{ color: styles.changeText }}
          >
            {change}
          </span> so với tháng trước
        </p>
      </CardContent>
    </Card>
  );
}
