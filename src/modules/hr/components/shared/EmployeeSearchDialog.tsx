import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Loader2 } from 'lucide-react';
import { EmployeeService } from '../../services/employeeService';
import type { Employee } from '../../types';

interface EmployeeSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string;
  onValueChange: (employeeId: string) => void;
}

export function EmployeeSearchDialog({ open, onOpenChange, value, onValueChange }: EmployeeSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setEmployees([]);
      setError(null);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setEmployees([]);
      setError(null);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const results = await EmployeeService.searchEmployees(searchQuery);
        setEmployees(results);
      } catch (err: any) {
        setError(err.message || 'Không thể tìm kiếm nhân viên');
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelect = (employee: Employee) => {
    onValueChange(employee.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tìm Nhân Viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nhập tên hoặc mã nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {!searchQuery.trim() || searchQuery.length < 2 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Nhập ít nhất 2 ký tự để bắt đầu tìm kiếm
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Đang tìm kiếm...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-sm text-destructive">
                {error}
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Không tìm thấy nhân viên nào
              </div>
            ) : (
              employees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => handleSelect(employee)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar} alt={employee.fullName} />
                    <AvatarFallback>{employee.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{employee.fullName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{employee.employeeCode}</span>
                      <span>•</span>
                      <span>{employee.position}</span>
                      <span>•</span>
                      <span>{employee.department}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
