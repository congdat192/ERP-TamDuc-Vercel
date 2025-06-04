
import { SalesManagement } from '@/modules/sales';

interface SalesPageProps {
  onBackToERP: () => void;
}

export function SalesPage({ onBackToERP }: SalesPageProps) {
  return <SalesManagement onBackToModules={onBackToERP} />;
}
