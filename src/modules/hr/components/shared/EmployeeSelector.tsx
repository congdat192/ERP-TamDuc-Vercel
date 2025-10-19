import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { EmployeeService } from '../../services/employeeService';
import type { Employee } from '../../types';

interface EmployeeSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function EmployeeSelector({
  value,
  onValueChange,
  placeholder = "Chọn nhân viên...",
  className,
  disabled = false
}: EmployeeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadEmployees = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('🔍 [EmployeeSelector] Loading employees...');
        const data = await EmployeeService.getEmployees();
        console.log(`✅ [EmployeeSelector] Loaded ${data.length} employees`);
        
        // Validate data structure
        if (data.length > 0) {
          const firstEmp = data[0];
          if (!firstEmp.fullName || !firstEmp.employeeCode) {
            console.error('❌ [EmployeeSelector] Invalid employee data structure:', firstEmp);
            throw new Error('Dữ liệu nhân viên không hợp lệ');
          }
        }
        
        setEmployees(data);
      } catch (err: any) {
        console.error('❌ [EmployeeSelector] Error loading employees:', err);
        const errorMessage = err.message || 'Không thể tải danh sách nhân viên';
        setError(errorMessage);
        toast({
          title: 'Lỗi',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, [toast]);

  const selectedEmployee = employees.find(emp => emp.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || isLoading || error !== null}
        >
          {isLoading ? (
            "Đang tải..."
          ) : error ? (
            <span className="text-destructive">Không thể tải danh sách</span>
          ) : selectedEmployee ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedEmployee.fullName || 'N/A'}</span>
              <span className="text-muted-foreground text-sm">
                {selectedEmployee.employeeCode || 'N/A'} - {selectedEmployee.position || 'N/A'}
              </span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Đang tải danh sách nhân viên...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-destructive">
            {error}
          </div>
        ) : employees.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Không có nhân viên nào
          </div>
        ) : (
          <Command>
            <CommandInput placeholder="Tìm tên hoặc mã nhân viên..." />
            <CommandEmpty>Không tìm thấy nhân viên</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {employees.map((employee) => {
                const searchValue = [
                  employee.fullName || '',
                  employee.employeeCode || '',
                  employee.position || 'N/A',
                  employee.department || 'N/A'
                ].filter(Boolean).join(' ');
                
                return (
                  <CommandItem
                    key={employee.id}
                    value={searchValue}
                    onSelect={() => {
                      onValueChange(employee.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === employee.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{employee.fullName || 'N/A'}</span>
                      <span className="text-sm text-muted-foreground">
                        {employee.employeeCode || 'N/A'} - {employee.position || 'N/A'} ({employee.department || 'N/A'})
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
