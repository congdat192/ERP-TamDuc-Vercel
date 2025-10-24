import { Search, Menu, ShoppingBag, Lightbulb, Zap, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { lensApi } from '../../services/lensApi';
import { LensRecommendationGroup } from '../../types/lens';

interface LensAppBarProps {
  onSearchChange: (query: string) => void;
  compareCount: number;
  onCompareClick: () => void;
  selectedRecommendation: LensRecommendationGroup | null;
  onRecommendationSelect: (group: LensRecommendationGroup | null) => void;
}

export function LensAppBar({ 
  onSearchChange, 
  compareCount, 
  onCompareClick,
  selectedRecommendation,
  onRecommendationSelect 
}: LensAppBarProps) {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['recommendation-groups'],
    queryFn: () => lensApi.getRecommendationGroups(),
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Left Section: Logo + Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button className="lg:hidden p-2 hover:bg-accent rounded-lg flex-shrink-0">
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
              <span className="text-white font-bold text-lg">TĐ</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight">Tâm Đức Lens</h1>
              <p className="text-xs text-muted-foreground">Catalog Tròng Kính</p>
            </div>
          </div>

          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm tròng kính..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick Recommendation Dropdown */}
          {!isLoading && groups && groups.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 border-2 border-orange-500 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold shadow-sm h-9"
                >
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="hidden sm:inline">Tư vấn nhanh</span>
                  {selectedRecommendation && (
                    <>
                      <span className="hidden md:inline text-muted-foreground">•</span>
                      <Badge className="hidden md:inline-flex bg-orange-600 text-white text-xs gap-1 pr-1">
                        <span>{selectedRecommendation.icon}</span>
                        <span>{selectedRecommendation.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecommendationSelect(null);
                          }}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          aria-label="Tắt tư vấn nhanh"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 z-[60]">
                {selectedRecommendation && (
                  <>
                    <DropdownMenuItem onClick={() => onRecommendationSelect(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Xem tất cả
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {groups.map((group) => (
                  <DropdownMenuItem
                    key={group.id}
                    onClick={() => onRecommendationSelect(group)}
                    className={selectedRecommendation?.id === group.id ? 'bg-accent' : ''}
                  >
                    <span className="mr-2 text-lg">{group.icon}</span>
                    <span className="flex-1">{group.name}</span>
                    <Badge
                      style={{ backgroundColor: group.color }}
                      className="ml-auto text-white text-xs"
                    >
                      {group.product_count || 0}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Tư vấn chọn kính */}
          <Link
            to="/lens-quiz"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm h-9"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="hidden lg:inline">Tư vấn chọn kính</span>
          </Link>
          
          {/* Compare Bag */}
          <button
            onClick={onCompareClick}
            className="relative p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {compareCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600 hover:bg-green-700 text-xs">
                {compareCount}
              </Badge>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
