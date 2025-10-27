
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Package,
  Calculator,
  UserCheck,
  Ticket,
  Settings,
  Shield,
  Building2,
  Home,
  Target,
  UserPlus,
  Megaphone,
  Wrench,
  Glasses
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Users,
  TrendingUp,
  Package,
  Calculator,
  UserCheck,
  Ticket,
  Settings,
  Shield,
  Building2,
  Home,
  Target,
  UserPlus,
  Megaphone,
  Wrench,
  Glasses
};

export function getIconComponent(iconName: string) {
  return iconMap[iconName as keyof typeof iconMap] || LayoutDashboard;
}
