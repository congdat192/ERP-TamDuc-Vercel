import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save, Download, MessageSquare, Mail, Smartphone, FolderOpen } from 'lucide-react';
import { AdvancedFilter, FilterGroup as FilterGroupType, MessageType } from '../types/filter';
import { ALL_FILTER_FIELDS } from '../utils/filterFields';
import { FilterGroup } from './FilterGroup';
import { SavedFiltersDrawer } from './SavedFiltersDrawer';
import { SaveFilterDialog } from './SaveFilterDialog';
import { MessageSendDialog } from './MessageSendDialog';
import { ActionHistoryManager } from '../utils/actionHistoryManager';

interface AdvancedFilterBuilderProps {
  filter: AdvancedFilter;
  onUpdate: (filter: AdvancedFilter) => void;
  onExecute: () => void;
  onSave: () => void;
  onExport: () => void;
  isExecuting: boolean;
  resultCount?: number;
  customerIds?: string[];
}

export function AdvancedFilterBuilder({
  filter,
  onUpdate,
  onExecute,
  onSave,
  onExport,
  isExecuting,
  resultCount,
  customerIds = []
}: AdvancedFilterBuilderProps) {
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>('zalo');
  
  const updateMainGroup = (groupId: string, updatedGroup: FilterGroupType) => {
    onUpdate({
      ...filter,
      groups: filter.groups.map(g => g.id === groupId ? updatedGroup : g)
    });
  };

  const removeMainGroup = (groupId: string) => {
    onUpdate({
      ...filter,
      groups: filter.groups.filter(g => g.id !== groupId)
    });
  };

  const addMainGroup = () => {
    const newGroup: FilterGroupType = {
      id: Date.now().toString(),
      logic: 'and',
      conditions: [{
        id: Date.now().toString() + '_condition',
        field: '',
        operator: 'equals',
        value: ''
      }]
    };

    onUpdate({
      ...filter,
      groups: [...filter.groups, newGroup]
    });
  };

  const duplicateMainGroup = (groupToDuplicate: FilterGroupType) => {
    const duplicatedGroup: FilterGroupType = {
      ...groupToDuplicate,
      id: Date.now().toString(),
      conditions: groupToDuplicate.conditions.map(c => ({
        ...c,
        id: Date.now().toString() + Math.random()
      })),
      groups: groupToDuplicate.groups?.map(g => ({
        ...g,
        id: Date.now().toString() + Math.random()
      }))
    };

    onUpdate({
      ...filter,
      groups: [...filter.groups, duplicatedGroup]
    });
  };

  const handleApplySavedFilter = (savedFilter: AdvancedFilter) => {
    onUpdate(savedFilter);
  };

  const handleSaveFilter = () => {
    setShowSaveDialog(true);
  };

  const handleFilterSaved = () => {
    // Add to action history
    ActionHistoryManager.addAction(
      'save_filter',
      resultCount || 0,
      filter.name || 'Bộ lọc không tên',
      filter
    );
  };

  const handleExport = () => {
    onExport();
    
    // Add to action history
    ActionHistoryManager.addAction(
      'export_excel',
      resultCount || 0,
      filter.name || 'Bộ lọc hiện tại',
      filter,
      { exportFormat: 'Excel' }
    );
  };

  const handleMessageSend = (type: MessageType) => {
    setMessageType(type);
    setShowMessageDialog(true);
  };

  const handleMessageSent = (type: MessageType, content: string, count: number) => {
    // Add to action history
    ActionHistoryManager.addAction(
      type === 'zalo' ? 'send_zalo' : type === 'email' ? 'send_email' : 'send_sms',
      count,
      filter.name || 'Bộ lọc hiện tại',
      filter,
      { messageContent: content.substring(0, 100) + (content.length > 100 ? '...' : '') }
    );
  };

  const hasValidConditions = filter.groups.some(group => 
    group.conditions.some(condition => condition.field && condition.operator) ||
    group.groups?.some(subGroup => 
      subGroup.conditions.some(condition => condition.field && condition.operator)
    )
  );

  return (
    <>
      <div className="space-y-6">
        {/* Filter Builder Card */}
        <Card className="theme-card">
          <CardHeader className="border-b theme-border-primary/20">
            <div className="flex items-center justify-between">
              <CardTitle className="theme-text">Bộ Lọc Khách Hàng Nâng Cao</CardTitle>
              
              {filter.groups.length > 1 && (
                <Select 
                  value={filter.logic} 
                  onValueChange={(value: 'and' | 'or') => onUpdate({ ...filter, logic: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="and">TẤT CẢ</SelectItem>
                    <SelectItem value="or">BẤT KỲ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {filter.groups.length > 1 && (
              <p className="text-sm theme-text-muted">
                {filter.logic === 'and' 
                  ? 'Khách hàng phải thỏa mãn TẤT CẢ các nhóm điều kiện bên dưới'
                  : 'Khách hàng chỉ cần thỏa mãn BẤT KỲ nhóm điều kiện nào bên dưới'
                }
              </p>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Filter Groups */}
            {filter.groups.map((group, index) => (
              <FilterGroup
                key={group.id}
                group={group}
                fields={ALL_FILTER_FIELDS}
                onUpdate={(updatedGroup) => updateMainGroup(group.id, updatedGroup)}
                onRemove={filter.groups.length > 1 ? () => removeMainGroup(group.id) : undefined}
                onDuplicate={() => duplicateMainGroup(group)}
                showRemove={filter.groups.length > 1}
                level={0}
              />
            ))}

            {/* Add Main Group Button */}
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={addMainGroup}
                className="theme-text border-2 border-dashed theme-border-primary/30 hover:theme-bg-primary/10"
              >
                + Thêm nhóm điều kiện mới
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={onExecute}
              disabled={!hasValidConditions || isExecuting}
              className="voucher-button-primary"
            >
              <Play className="w-4 h-4 mr-2" />
              {isExecuting ? 'Đang lọc...' : 'Thực hiện lọc'}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowSavedFilters(true)}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Bộ lọc đã lưu
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveFilter}
              disabled={!hasValidConditions}
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu bộ lọc
            </Button>

            {resultCount !== undefined && (
              <span className="text-sm theme-text-muted">
                Tìm thấy <strong className="theme-text-primary">{resultCount.toLocaleString()}</strong> khách hàng
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={resultCount === undefined || resultCount === 0}
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>

            <Button
              variant="outline"
              onClick={() => handleMessageSend('zalo')}
              disabled={resultCount === undefined || resultCount === 0}
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Gửi Zalo
            </Button>

            <Button
              variant="outline"
              onClick={() => handleMessageSend('email')}
              disabled={resultCount === undefined || resultCount === 0}
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Gửi Email
            </Button>

            <Button
              variant="outline"
              onClick={() => handleMessageSend('sms')}
              disabled={resultCount === undefined || resultCount === 0}
              size="sm"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Gửi SMS
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SavedFiltersDrawer
        isOpen={showSavedFilters}
        onClose={() => setShowSavedFilters(false)}
        onApplyFilter={handleApplySavedFilter}
      />

      <SaveFilterDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        filter={filter}
        customerCount={resultCount || 0}
        onFilterSaved={handleFilterSaved}
      />

      <MessageSendDialog
        isOpen={showMessageDialog}
        onClose={() => setShowMessageDialog(false)}
        messageType={messageType}
        customerIds={customerIds}
        customerCount={resultCount || 0}
        onMessageSent={handleMessageSent}
      />
    </>
  );
}
