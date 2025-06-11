
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronRight, Search, Plus } from 'lucide-react';
import { CategoryNode } from '@/data/inventoryMockData';

interface CategoryTreeSelectorProps {
  categories: CategoryNode[];
  selectedCategories: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function CategoryTreeSelector({ categories, selectedCategories, onSelectionChange }: CategoryTreeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onSelectionChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onSelectionChange([...selectedCategories, categoryId]);
    }
  };

  const handleSelectAll = () => {
    const allIds = getAllCategoryIds(categories);
    onSelectionChange(allIds);
  };

  const getAllCategoryIds = (nodes: CategoryNode[]): string[] => {
    let ids: string[] = [];
    nodes.forEach(node => {
      ids.push(node.id);
      if (node.children) {
        ids = ids.concat(getAllCategoryIds(node.children));
      }
    });
    return ids;
  };

  const filterCategories = (nodes: CategoryNode[], search: string): CategoryNode[] => {
    if (!search) return nodes;
    
    return nodes.filter(node => {
      const matches = node.name.toLowerCase().includes(search.toLowerCase());
      const hasMatchingChildren = node.children && filterCategories(node.children, search).length > 0;
      return matches || hasMatchingChildren;
    }).map(node => ({
      ...node,
      children: node.children ? filterCategories(node.children, search) : undefined
    }));
  };

  const renderCategoryNode = (node: CategoryNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedCategories.includes(node.id);

    return (
      <div key={node.id} className="space-y-1">
        <div 
          className="flex items-center gap-2 py-1 px-2 hover:theme-bg-primary/5 rounded"
          style={{ paddingLeft: `${8 + level * 16}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:theme-bg-primary/10"
              onClick={() => toggleExpanded(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => handleCategoryToggle(node.id)}
            className="h-4 w-4"
          />
          
          <div className="flex items-center justify-between flex-1 min-w-0">
            <span className="text-sm theme-text truncate">{node.name}</span>
            <span className="text-xs theme-text-muted ml-2 flex-shrink-0">
              ({node.productCount})
            </span>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map(child => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredCategories = filterCategories(categories, searchTerm);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium theme-text">Nhóm hàng</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between voucher-input h-10 rounded-md">
            <span className="truncate">
              {selectedCategories.length > 0 
                ? `Đã chọn ${selectedCategories.length} nhóm` 
                : "Chọn nhóm hàng"
              }
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 theme-card border theme-border-primary shadow-lg z-50 rounded-lg" align="start">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium theme-text">Chọn nhóm hàng</span>
              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                <Plus className="h-3 w-3" />
                Tạo mới
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 theme-text-muted" />
              <Input
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 rounded-md"
              />
            </div>
          </div>

          {/* Tree content */}
          <ScrollArea className="h-[300px] p-2">
            <div className="space-y-1">
              {filteredCategories.map(category => renderCategoryNode(category))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Chọn tất cả
            </Button>
            <Button onClick={() => setOpen(false)} className="voucher-button-primary">
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
