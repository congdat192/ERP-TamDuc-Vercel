
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Package, 
  Calculator, 
  UserCheck, 
  Ticket, 
  Megaphone, 
  Settings, 
  UserCog,
  Share2,
  LucideIcon
} from 'lucide-react';

export const getIconComponent = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    BarChart3,
    Users,
    ShoppingCart,
    Package,
    Calculator,
    UserCheck,
    Ticket,
    Megaphone,
    Settings,
    UserCog,
    Share2
  };
  
  return iconMap[iconName] || BarChart3;
};
