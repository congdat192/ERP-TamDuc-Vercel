
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SalesHeaderProps {
  onBackToModules: () => void;
}

export function SalesHeader({ onBackToModules }: SalesHeaderProps) {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToModules}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay về ERP
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Hóa Đơn</h1>
        </div>
      </div>
    </div>
  );
}
