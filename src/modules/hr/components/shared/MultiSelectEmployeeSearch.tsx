import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { EmployeeService } from '../../services/employeeService';
import type { Employee } from '../../types';

interface MultiSelectEmployeeSearchProps {
  value: string[]; // Array of employee IDs
  onChange: (employeeIds: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
}

export function MultiSelectEmployeeSearch({
  value,
  onChange,
  placeholder = 'Nhập tên hoặc mã nhân viên...',
  maxSelections,
}: MultiSelectEmployeeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load selected employees details
  useEffect(() => {
    const loadSelectedEmployees = async () => {
      if (value.length === 0) {
        setSelectedEmployees([]);
        return;
      }

      const employees = await Promise.all(
        value.map(async (id) => {
          try {
            return await EmployeeService.getEmployeeById(id);
          } catch {
            return null;
          }
        })
      );

      setSelectedEmployees(employees.filter((e): e is Employee => e !== null));
    };

    loadSelectedEmployees();
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const results = await EmployeeService.searchEmployees(searchQuery, 10);
        // Filter out already selected employees
        const filtered = results.filter(emp => !value.includes(emp.id));
        setSearchResults(filtered);
      } catch (error) {
        console.error('Error searching employees:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (employee: Employee) => {
    if (maxSelections && value.length >= maxSelections) {
      return;
    }

    const newValue = [...value, employee.id];
    onChange(newValue);
    setSearchQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const handleRemove = (employeeId: string) => {
    const newValue = value.filter(id => id !== employeeId);
    onChange(newValue);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative" ref={dropdownRef}>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          disabled={maxSelections ? value.length >= maxSelections : false}
        />

        {/* Dropdown Results */}
        {showDropdown && searchQuery.length >= 2 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-[300px] overflow-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                Đang tìm kiếm...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((employee) => (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => handleSelect(employee)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={employee.avatar || undefined} />
                    <AvatarFallback>
                      {employee.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{employee.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {employee.employeeCode} • {employee.position}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground text-center">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Employees Tags */}
      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={employee.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {employee.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{employee.fullName}</span>
              <button
                type="button"
                onClick={() => handleRemove(employee.id)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Max selections hint */}
      {maxSelections && (
        <p className="text-xs text-muted-foreground">
          Đã chọn {value.length}/{maxSelections} nhân viên
        </p>
      )}
    </div>
  );
}
