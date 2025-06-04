
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ColumnVisibilityFilter } from './ColumnVisibilityFilter';
import { ColumnConfig } from './ColumnVisibilityFilter';

interface CustomerSearchActionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  columns: ColumnConfig[];
  handleColumnToggle: (columnKey: string, visible: boolean) => void;
}

export function CustomerSearchActions({ 
  searchTerm, 
  setSearchTerm, 
  columns, 
  handleColumnToggle 
}: CustomerSearchActionsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Theo mã, tên, số điện thoại"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center">
            <ColumnVisibilityFilter 
              columns={columns}
              onColumnToggle={handleColumnToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
