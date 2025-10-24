import { Search, Menu, ShoppingBag, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface LensAppBarProps {
  onSearchChange: (query: string) => void;
  compareCount: number;
  onCompareClick: () => void;
}

export function LensAppBar({ onSearchChange, compareCount, onCompareClick }: LensAppBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-accent rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
              <span className="text-white font-bold text-lg">TĐ</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Tâm Đức Lens</h1>
              <p className="text-xs text-muted-foreground">Catalog Tròng Kính</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm tròng kính..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/lens-quiz"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Tư vấn chọn kính</span>
          </Link>
          
          <button
            onClick={onCompareClick}
            className="relative p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {compareCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600 hover:bg-green-700">
                {compareCount}
              </Badge>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
