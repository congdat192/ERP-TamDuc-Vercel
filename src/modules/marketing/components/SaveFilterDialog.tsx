
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdvancedFilter } from '../types/filter';
import { SavedFiltersManager } from '../utils/savedFiltersManager';

interface SaveFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filter: AdvancedFilter;
  customerCount: number;
  onFilterSaved: () => void;
}

export function SaveFilterDialog({ 
  isOpen, 
  onClose, 
  filter, 
  customerCount, 
  onFilterSaved 
}: SaveFilterDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      SavedFiltersManager.saveFilter(name.trim(), description.trim(), filter, customerCount);
      onFilterSaved();
      handleClose();
    } catch (error) {
      console.error('Error saving filter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="theme-text">Lưu Bộ Lọc</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filter-name">Tên bộ lọc *</Label>
            <Input
              id="filter-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên bộ lọc"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="filter-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về bộ lọc này"
              rows={3}
            />
          </div>

          <div className="text-sm theme-text-muted">
            Bộ lọc này sẽ áp dụng cho <strong>{customerCount.toLocaleString()}</strong> khách hàng
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="flex-1 voucher-button-primary"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu Bộ Lọc'}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
