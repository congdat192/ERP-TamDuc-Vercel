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

  useEffect(() => {
    const loadEmployees = async () => {
      setIsLoading(true);
      try {
        const data = await EmployeeService.getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error('❌ Error loading employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const selectedEmployee = employees.find(emp => emp.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            "Đang tải..."
          ) : selectedEmployee ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedEmployee.fullName}</span>
              <span className="text-muted-foreground text-sm">
                {selectedEmployee.employeeCode} - {selectedEmployee.position}
              </span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm tên hoặc mã nhân viên..." />
          <CommandEmpty>Không tìm thấy nhân viên</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {employees.map((employee) => (
              <CommandItem
                key={employee.id}
                value={`${employee.fullName} ${employee.employeeCode} ${employee.position} ${employee.department}`}
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
                  <span className="font-medium">{employee.fullName}</span>
                  <span className="text-sm text-muted-foreground">
                    {employee.employeeCode} - {employee.position} ({employee.department})
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
