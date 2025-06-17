
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, 
  Pencil, 
  Trash, 
  Save, 
  Calendar,
  Users,
  X
} from 'lucide-react';
import { SavedFilterSegment, AdvancedFilter } from '../types/filter';
import { SavedFiltersManager } from '../utils/savedFiltersManager';

interface SavedFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filter: AdvancedFilter) => void;
}

export function SavedFiltersDrawer({ isOpen, onClose, onApplyFilter }: SavedFiltersDrawerProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilterSegment[]>(
    SavedFiltersManager.getSavedFilters()
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const refreshFilters = () => {
    setSavedFilters(SavedFiltersManager.getSavedFilters());
  };

  const handleApplyFilter = (savedFilter: SavedFilterSegment) => {
    onApplyFilter(savedFilter.filter);
    onClose();
  };

  const handleStartEdit = (filter: SavedFilterSegment) => {
    setEditingId(filter.id);
    setEditName(filter.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      SavedFiltersManager.renameFilter(id, editName.trim());
      refreshFilters();
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDeleteFilter = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bộ lọc này?')) {
      SavedFiltersManager.deleteFilter(id);
      refreshFilters();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="theme-text">Bộ Lọc Đã Lưu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {savedFilters.length === 0 ? (
            <div className="text-center py-8">
              <div className="theme-text-muted mb-2">Chưa có bộ lọc nào được lưu</div>
              <p className="text-sm theme-text-muted">
                Tạo và lưu bộ lọc để sử dụng lại trong tương lai
              </p>
            </div>
          ) : (
            savedFilters.map((filter) => (
              <Card key={filter.id} className="theme-card border theme-border-primary/20">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Filter Name */}
                    <div className="flex items-center justify-between">
                      {editingId === filter.id ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(filter.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(filter.id)}
                            className="voucher-button-primary"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-medium theme-text">{filter.name}</h4>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStartEdit(filter)}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteFilter(filter.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Filter Description */}
                    {filter.description && (
                      <p className="text-sm theme-text-muted">{filter.description}</p>
                    )}

                    {/* Filter Metadata */}
                    <div className="flex items-center justify-between text-xs theme-text-muted">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{filter.customerCount.toLocaleString()} KH</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(filter.createdAt)}</span>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {filter.filter.groups.length} nhóm điều kiện
                      </Badge>
                    </div>

                    {/* Apply Button */}
                    <Button
                      onClick={() => handleApplyFilter(filter)}
                      className="w-full voucher-button-primary"
                      size="sm"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Áp Dụng Bộ Lọc
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
