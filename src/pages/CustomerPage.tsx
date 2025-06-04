
import { CustomerManagement } from '@/modules/customer';

interface CustomerPageProps {
  onBackToERP: () => void;
}

export function CustomerPage({ onBackToERP }: CustomerPageProps) {
  return <CustomerManagement onBackToModules={onBackToERP} />;
}
