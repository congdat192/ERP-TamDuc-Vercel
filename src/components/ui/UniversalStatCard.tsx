
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface UniversalStatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  colorIndex: number; // 0: primary, 1: secondary, 2: success, 3: orange
}

const getCardStyles = (index: number) => {
  switch (index % 4) {
    case 0: // Primary color from preset
      return {
        backgroundColor: 'hsl(var(--voucher-primary-500))',
        hoverColor: 'hsl(var(--voucher-primary-600))',
      };
    case 1: // Secondary color from preset
      return {
        backgroundColor: 'hsl(var(--voucher-secondary-500))',
        hoverColor: 'hsl(var(--voucher-secondary-600))',
      };
    case 2: // Success color (fixed semantic color)
      return {
        backgroundColor: 'hsl(var(--berry-success-500))', // #00E676
        hoverColor: 'hsl(var(--berry-success-600))',
      };
    case 3: // Orange color (fixed semantic color)
      return {
        backgroundColor: '#FFAB91', // Orange main from user's palette
        hoverColor: '#FF8A65', // Slightly darker orange for hover
      };
    default:
      return {
        backgroundColor: 'hsl(var(--voucher-primary-500))',
        hoverColor: 'hsl(var(--voucher-primary-600))',
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
    <Card 
      className="hover:shadow-lg transition-all duration-200 border-0 cursor-pointer group"
      style={{ 
        backgroundColor: styles.backgroundColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = styles.hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = styles.backgroundColor;
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/90">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-white/80">
          <span className="font-medium text-white">
            {change}
          </span> so với tháng trước
        </p>
      </CardContent>
    </Card>
  );
}
