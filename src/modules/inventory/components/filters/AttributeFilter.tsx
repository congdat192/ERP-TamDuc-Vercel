import { MultiSelectFilter } from './MultiSelectFilter';

interface AttributeFilterProps {
  attributes: Array<{ id: number; name: string; values: string[] }>;
  selectedAttributes: Record<string, string[]>;
  onAttributeChange: (attrName: string, values: string[]) => void;
}

export function AttributeFilter({ 
  attributes, 
  selectedAttributes, 
  onAttributeChange 
}: AttributeFilterProps) {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium theme-text">Thuộc tính sản phẩm</label>
      
      {attributes.map(attr => (
        <div key={attr.id} className="space-y-2">
          <label className="text-sm theme-text-muted">{attr.name}</label>
          <MultiSelectFilter
            label=""
            placeholder={`Chọn ${attr.name}`}
            options={attr.values.map(v => ({ label: v, value: v }))}
            selectedValues={selectedAttributes[attr.name] || []}
            onSelectionChange={(values) => onAttributeChange(attr.name, values)}
          />
        </div>
      ))}
    </div>
  );
}
