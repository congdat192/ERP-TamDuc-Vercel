
import { VoucherModule } from '@/modules/voucher';

interface VoucherPageProps {
  onBackToERP: () => void;
}

export function VoucherPage({ onBackToERP }: VoucherPageProps) {
  return <VoucherModule onBackToModules={onBackToERP} />;
}
