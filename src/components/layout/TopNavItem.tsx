import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopNavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
}

export function TopNavItem({ icon: Icon, label, path, isActive, onClick }: TopNavItemProps) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors whitespace-nowrap",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-foreground/70 hover:text-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}
