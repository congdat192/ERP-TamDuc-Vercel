import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Glasses, ArrowRight } from 'lucide-react';

export function LensAdminTab() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Glasses className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 theme-text">Quản lý Lens Catalog</h3>
        <p className="theme-text-muted mb-6">
          Quản lý sản phẩm tròng kính, thương hiệu, đặc tính và banner quảng cáo
        </p>
        <Button 
          onClick={() => navigate('/ERP/Marketing/Lens-Admin')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Vào trang quản lý
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
