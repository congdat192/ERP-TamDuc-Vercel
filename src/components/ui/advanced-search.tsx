
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  Calendar,
  User,
  Tag,
  MapPin,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onClear: () => void;
  placeholder?: string;
  searchFields?: SearchField[];
  quickFilters?: QuickFilter[];
  savedSearches?: SavedSearch[];
}

interface SearchField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { label: string; value: string }[];
  operators?: string[];
}

interface QuickFilter {
  label: string;
  icon: React.ReactNode;
  filters: SearchFilter[];
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilter[];
  icon?: React.ReactNode;
}

export const AdvancedSearch = ({
  onSearch,
  onClear,
  placeholder = "Tìm kiếm...",
  searchFields = [],
  quickFilters = [],
  savedSearches = []
}: AdvancedSearchProps) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleClear = () => {
    setQuery('');
    setFilters([]);
    onClear();
  };

  const addFilter = (field: SearchField, operator: string, value: string) => {
    const newFilter: SearchFilter = {
      id: Date.now().toString(),
      field: field.key,
      operator,
      value,
      label: `${field.label} ${operator} ${value}`
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const applyQuickFilter = (quickFilter: QuickFilter) => {
    setFilters([...filters, ...quickFilter.filters]);
  };

  const applySavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query);
    setFilters(savedSearch.filters);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4"
              />
            </div>
            
            <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <AdvancedFilterPanel
                  searchFields={searchFields}
                  onAddFilter={addFilter}
                />
              </PopoverContent>
            </Popover>

            <Button onClick={handleSearch}>
              Tìm Kiếm
            </Button>

            {(query || filters.length > 0) && (
              <Button variant="outline" onClick={handleClear}>
                <X className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 self-center">Bộ lọc:</span>
              {filters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Quick Filters */}
          {quickFilters.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Bộ lọc nhanh:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((quickFilter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickFilter(quickFilter)}
                    className="flex items-center space-x-1"
                  >
                    {quickFilter.icon}
                    <span>{quickFilter.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tìm kiếm đã lưu:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((savedSearch) => (
                  <Button
                    key={savedSearch.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => applySavedSearch(savedSearch)}
                    className="flex items-center space-x-1"
                  >
                    {savedSearch.icon || <Search className="w-3 h-3" />}
                    <span>{savedSearch.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface AdvancedFilterPanelProps {
  searchFields: SearchField[];
  onAddFilter: (field: SearchField, operator: string, value: string) => void;
}

const AdvancedFilterPanel = ({ searchFields, onAddFilter }: AdvancedFilterPanelProps) => {
  const [selectedField, setSelectedField] = useState<SearchField | null>(null);
  const [operator, setOperator] = useState('');
  const [value, setValue] = useState('');

  const getOperatorsForFieldType = (type: string) => {
    switch (type) {
      case 'text':
        return [
          { value: 'contains', label: 'chứa' },
          { value: 'equals', label: 'bằng' },
          { value: 'starts_with', label: 'bắt đầu với' },
          { value: 'ends_with', label: 'kết thúc với' }
        ];
      case 'number':
        return [
          { value: 'equals', label: 'bằng' },
          { value: 'greater_than', label: 'lớn hơn' },
          { value: 'less_than', label: 'nhỏ hơn' },
          { value: 'between', label: 'trong khoảng' }
        ];
      case 'date':
        return [
          { value: 'equals', label: 'bằng' },
          { value: 'after', label: 'sau' },
          { value: 'before', label: 'trước' },
          { value: 'between', label: 'trong khoảng' }
        ];
      case 'select':
        return [
          { value: 'equals', label: 'bằng' },
          { value: 'not_equals', label: 'không bằng' }
        ];
      default:
        return [];
    }
  };

  const handleAddFilter = () => {
    if (selectedField && operator && value) {
      onAddFilter(selectedField, operator, value);
      setSelectedField(null);
      setOperator('');
      setValue('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Trường</Label>
        <Select onValueChange={(fieldKey) => {
          const field = searchFields.find(f => f.key === fieldKey);
          setSelectedField(field || null);
          setOperator('');
          setValue('');
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trường tìm kiếm" />
          </SelectTrigger>
          <SelectContent>
            {searchFields.map((field) => (
              <SelectItem key={field.key} value={field.key}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedField && (
        <>
          <div className="space-y-2">
            <Label>Điều kiện</Label>
            <Select value={operator} onValueChange={setOperator}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn điều kiện" />
              </SelectTrigger>
              <SelectContent>
                {getOperatorsForFieldType(selectedField.type).map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Giá trị</Label>
            {selectedField.type === 'select' && selectedField.options ? (
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giá trị" />
                </SelectTrigger>
                <SelectContent>
                  {selectedField.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={selectedField.type === 'number' ? 'number' : 
                      selectedField.type === 'date' ? 'date' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Nhập giá trị"
              />
            )}
          </div>

          <Button 
            onClick={handleAddFilter} 
            className="w-full"
            disabled={!operator || !value}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm Bộ Lọc
          </Button>
        </>
      )}
    </div>
  );
};
