
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Eye, Monitor, Smartphone } from 'lucide-react';
import { ThemeModeToggle } from '@/components/theme/ThemeModeToggle';
import { PresetColorPicker } from '@/components/theme/PresetColorPicker';

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold theme-text">Giao Diện & Thương Hiệu</h3>
        <p className="theme-text-muted">Tùy chỉnh giao diện và thương hiệu của hệ thống</p>
      </div>

      {/* Theme Customization */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Tùy Chỉnh Theme</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-4">
            <ThemeModeToggle />
          </div>

          {/* Color Presets */}
          <div className="space-y-4">
            <PresetColorPicker />
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium theme-text flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Xem Trước Theme</span>
            </h4>
            <div className="p-4 rounded-lg theme-border-primary/20 border space-y-4">
              {/* Gradient header */}
              <div className="theme-gradient h-16 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">Header với Theme Gradient</span>
              </div>
              
              {/* Buttons */}
              <div className="flex space-x-2">
                <Button size="sm" className="theme-bg-primary text-white hover:opacity-90">
                  Primary Button
                </Button>
                <Button variant="outline" size="sm" className="theme-border-primary theme-text-primary hover:theme-bg-primary hover:text-white">
                  Secondary Button
                </Button>
              </div>
              
              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg theme-bg-primary/10 theme-border-primary/20 border">
                  <div className="text-xs theme-text-muted">Tổng Người Dùng</div>
                  <div className="text-lg font-bold theme-text-primary">1,234</div>
                </div>
                <div className="p-3 rounded-lg theme-bg-secondary/10 theme-border-secondary/20 border">
                  <div className="text-xs theme-text-muted">Doanh Thu</div>
                  <div className="text-lg font-bold theme-text-secondary">56.7M VND</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Design */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="w-5 h-5 theme-text-secondary" />
            <span className="theme-text">Responsive Design</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg theme-bg-primary/5 border theme-border-primary/20">
              <Monitor className="w-8 h-8 theme-text-primary" />
              <div>
                <div className="font-medium theme-text">Desktop</div>
                <div className="text-sm theme-text-muted">Tối ưu cho màn hình lớn</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg theme-bg-secondary/5 border theme-border-secondary/20">
              <Smartphone className="w-8 h-8 theme-text-secondary" />
              <div>
                <div className="font-medium theme-text">Mobile</div>
                <div className="text-sm theme-text-muted">Thân thiện với thiết bị di động</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
