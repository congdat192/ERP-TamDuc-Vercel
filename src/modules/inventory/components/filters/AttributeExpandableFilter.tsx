
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProductAttribute } from '@/data/inventoryMockData';
import { MultiSelectFilter } from './MultiSelectFilter';

interface AttributeExpandableFilterProps {
  attributes: ProductAttribute[];
  selectedAttributes: Record<string, string[]>;
  onAttributeChange: (key: string, values: string[]) => void;
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
    <MultiSelectFilter
      key={attribute.key}
      label={attribute.label}
      placeholder={`Chọn ${attribute.label.toLowerCase()}`}
      options={attribute.options}
      selectedValues={selectedAttributes[attribute.key] || []}
      onSelectionChange={(values) => onAttributeChange(attribute.key, values)}
    />
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
