import { useQuery } from '@tanstack/react-query';
import { Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { lensApi } from '../../services/lensApi';
import { LensRecommendationGroup } from '../../types/lens';

interface QuickRecommendationSelectorProps {
  selectedGroup: LensRecommendationGroup | null;
  onSelect: (group: LensRecommendationGroup | null) => void;
}

export function QuickRecommendationSelector({ selectedGroup, onSelect }: QuickRecommendationSelectorProps) {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['recommendation-groups'],
    queryFn: () => lensApi.getRecommendationGroups(),
  });

  if (isLoading || !groups || groups.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-3 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Zap className="w-4 h-4" />
            <span>Tư vấn nhanh</span>
            {selectedGroup && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="font-medium">{selectedGroup.name}</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {selectedGroup && (
            <>
              <DropdownMenuItem onClick={() => onSelect(null)}>
                <X className="w-4 h-4 mr-2" />
                Xem tất cả
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {groups.map((group) => (
            <DropdownMenuItem
              key={group.id}
              onClick={() => onSelect(group)}
              className={selectedGroup?.id === group.id ? 'bg-accent' : ''}
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

      {selectedGroup && (
        <Badge
          style={{ backgroundColor: selectedGroup.color }}
          className="text-white gap-1"
        >
          <span>{selectedGroup.icon}</span>
          <span>{selectedGroup.name}</span>
          <button
            onClick={() => onSelect(null)}
            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
