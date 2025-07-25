
import { SalesModule } from '@/modules/sales';

interface SalesPageProps {
  onBackToERP?: () => void;
}

export function SalesPage({ onBackToERP }: SalesPageProps) {
  return <SalesModule />;
}
