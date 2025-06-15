
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">Giao Diện & Thương Hiệu</h3>
        <p className="text-gray-600">Tùy chỉnh giao diện và thương hiệu của hệ thống</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-blue-600" />
            <span>Tùy Chỉnh Giao Diện</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Module đang được phát triển...</p>
        </CardContent>
      </Card>
    </div>
  );
}
