
import { CustomerModule } from '@/modules/customer';

interface CustomerPageProps {
  onBackToERP: () => void;
}

export function CustomerPage({ onBackToERP }: CustomerPageProps) {
  return <CustomerModule onBackToModules={onBackToERP} />;
}
