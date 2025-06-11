
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProductAttribute } from '@/data/inventoryMockData';

interface AttributeExpandableFilterProps {
  attributes: ProductAttribute[];
  selectedAttributes: Record<string, string>;
  onAttributeChange: (key: string, value: string) => void;
}

export function AttributeExpandableFilter({ 
  attributes, 
  selectedAttributes, 
  onAttributeChange 
}: AttributeExpandableFilterProps) {
  const [expanded, setExpanded] = useState(false);

  // First 3 attributes are always visible
  const mainAttributes = attributes.slice(0, 3);
  const extendedAttributes = attributes.slice(3);

  const renderAttributeSelect = (attribute: ProductAttribute) => (
    <div key={attribute.key} className="space-y-2">
      <label className="text-sm font-medium theme-text">{attribute.label}</label>
      <Select 
        value={selectedAttributes[attribute.key] || 'all'} 
        onValueChange={(value) => onAttributeChange(attribute.key, value)}
      >
        <SelectTrigger className="voucher-input h-10 rounded-md">
          <SelectValue placeholder={`Chọn ${attribute.label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
          <SelectItem value="all">Tất cả</SelectItem>
          {attribute.options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium theme-text">Thuộc tính</label>
      
      {/* Main attributes - always visible */}
      <div className="space-y-2">
        {mainAttributes.map(renderAttributeSelect)}
      </div>

      {/* Extended attributes - shown when expanded */}
      {expanded && (
        <div className="space-y-2 pt-2 border-t border-border">
          {extendedAttributes.map(renderAttributeSelect)}
        </div>
      )}

      {/* Expand/Collapse button */}
      {extendedAttributes.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full h-8 text-xs gap-2 mt-2 theme-border-primary hover:theme-bg-primary/10 rounded-md"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Thu gọn
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Mở rộng
            </>
          )}
        </Button>
      )}
    </div>
  );
}
