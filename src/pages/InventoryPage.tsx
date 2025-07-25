
import { InventoryModule } from '@/modules/inventory';

interface InventoryPageProps {
  onBackToERP?: () => void;
}

export function InventoryPage({ onBackToERP }: InventoryPageProps) {
  return <InventoryModule />;
}
