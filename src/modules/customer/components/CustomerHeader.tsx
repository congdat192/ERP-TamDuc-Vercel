
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CustomerHeaderProps {
  onBackToModules?: () => void; // Made optional for backward compatibility
}

export function CustomerHeader({ onBackToModules }: CustomerHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackToModules) {
      onBackToModules();
    } else {
      navigate('/erp');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackClick}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại ERP
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Khách hàng</h1>
        </div>
      </div>
    </div>
  );
}
