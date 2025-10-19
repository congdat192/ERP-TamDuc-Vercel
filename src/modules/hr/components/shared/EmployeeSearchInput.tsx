import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { EmployeeSearchDialog } from './EmployeeSearchDialog';
import { EmployeeService } from '../../services/employeeService';
import type { Employee } from '../../types';

interface EmployeeSearchInputProps {
  value?: string;
  onValueChange: (employeeId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function EmployeeSearchInput({ 
  value, 
  onValueChange, 
  placeholder = 'Tìm nhân viên...',
  disabled = false
}: EmployeeSearchInputProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (value) {
      EmployeeService.getEmployeeById(value, false, false)
        .then(employee => setSelectedEmployee(employee))
        .catch(() => setSelectedEmployee(null));
    } else {
      setSelectedEmployee(null);
    }
  }, [value]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
    setSelectedEmployee(null);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setDialogOpen(true)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-2 border rounded-md px-3 py-2 text-left bg-background hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedEmployee ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.fullName} />
              <AvatarFallback>{selectedEmployee.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedEmployee.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {selectedEmployee.employeeCode} • {selectedEmployee.position}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedEmployee && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-destructive/10"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>

      <EmployeeSearchDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}
