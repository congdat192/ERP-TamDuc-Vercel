
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Building2, ChevronDown, Check, Settings, BarChart3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/contexts/StoreContext';
import { useNavigate } from 'react-router-dom';
import { StoreEntity } from '@/types/store';

interface StoreSelectorProps {
  className?: string;
  showManageStores?: boolean;
  showCompareMode?: boolean;
  mode?: 'single' | 'multiple' | 'all';
  onModeChange?: (mode: 'single' | 'multiple' | 'all') => void;
}

export function StoreSelector({ 
  className, 
  showManageStores = true,
  showCompareMode = true,
  mode = 'single',
  onModeChange
}: StoreSelectorProps) {
  const { 
    stores, 
    currentStore, 
    selectedStoreIds,
    setCurrentStore, 
    setSelectedStoreIds,
    selectAllStores,
    clearStoreSelection,
    getActiveStores 
  } = useStore();
  
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const activeStores = getActiveStores();

  const handleStoreSelect = (store: StoreEntity) => {
    if (mode === 'single') {
      setCurrentStore(store);
      setIsOpen(false);
    } else if (mode === 'multiple') {
      const isSelected = selectedStoreIds.includes(store.id);
      if (isSelected) {
        setSelectedStoreIds(selectedStoreIds.filter(id => id !== store.id));
      } else {
        setSelectedStoreIds([...selectedStoreIds, store.id]);
      }
    }
  };

  const handleAllStoresSelect = () => {
    if (onModeChange) {
      onModeChange('all');
    }
    selectAllStores();
    setCurrentStore(null);
    setIsOpen(false);
  };

  const handleCompareMode = () => {
    if (onModeChange) {
      onModeChange('multiple');
    }
    setCurrentStore(null);
    setIsOpen(false);
  };

  const handleManageStores = () => {
    navigate('/ERP/Setting/Stores');
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (mode === 'all') {
      return `Tất cả cửa hàng (${activeStores.length})`;
    } else if (mode === 'multiple') {
      if (selectedStoreIds.length === 0) {
        return 'Chọn cửa hàng để so sánh';
      } else if (selectedStoreIds.length === 1) {
        const store = stores.find(s => s.id === selectedStoreIds[0]);
        return store?.name || 'Cửa hàng đã chọn';
      } else {
        return `${selectedStoreIds.length} cửa hàng được chọn`;
      }
    } else {
      return currentStore?.name || 'Chọn cửa hàng';
    }
  };

  const getStoreIcon = (store: StoreEntity) => {
    if (store.is_main_store) {
      return <Store className="w-4 h-4 text-yellow-500" />;
    }
    return <Building2 className="w-4 h-4 text-gray-500" />;
  };

  if (stores.length === 0) {
    return (
      <Button
        variant="outline"
        onClick={handleManageStores}
        className={`flex items-center space-x-2 ${className}`}
      >
        <Building2 className="w-4 h-4" />
        <span>Tạo cửa hàng</span>
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center space-x-2 min-w-48 justify-between ${className}`}
        >
          <div className="flex items-center space-x-2 min-w-0">
            {mode === 'all' ? (
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
            ) : mode === 'multiple' ? (
              <Building2 className="w-4 h-4 flex-shrink-0" />
            ) : currentStore ? (
              getStoreIcon(currentStore)
            ) : (
              <Building2 className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="truncate text-sm">{getDisplayText()}</span>
          </div>
          <ChevronDown className="w-4 h-4 flex-shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="start">
        <DropdownMenuLabel>Chọn cửa hàng</DropdownMenuLabel>
        
        {/* All Stores Option */}
        <DropdownMenuItem
          onClick={handleAllStoresSelect}
          className="flex items-center justify-between p-3"
        >
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <div>
              <span className="font-medium">Tất cả cửa hàng</span>
              <div className="text-xs text-muted-foreground">
                Xem tổng hợp dữ liệu từ {activeStores.length} cửa hàng
              </div>
            </div>
          </div>
          {mode === 'all' && <Check className="w-4 h-4 text-green-600" />}
        </DropdownMenuItem>

        {/* Compare Mode Option */}
        {showCompareMode && (
          <DropdownMenuItem
            onClick={handleCompareMode}
            className="flex items-center justify-between p-3"
          >
            <div className="flex items-center space-x-3">
              <Building2 className="w-4 h-4 text-purple-500" />
              <div>
                <span className="font-medium">So sánh cửa hàng</span>
                <div className="text-xs text-muted-foreground">
                  Chọn nhiều cửa hàng để so sánh
                </div>
              </div>
            </div>
            {mode === 'multiple' && <Check className="w-4 h-4 text-green-600" />}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Individual Stores */}
        <div className="max-h-64 overflow-y-auto">
          {activeStores.map((store) => (
            <DropdownMenuItem
              key={store.id}
              onClick={() => handleStoreSelect(store)}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center space-x-3 min-w-0">
                {getStoreIcon(store)}
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium truncate">{store.name}</span>
                    {store.is_main_store && (
                      <Badge variant="secondary" className="text-xs">
                        Chính
                      </Badge>
                    )}
                  </div>
                  {store.code && (
                    <div className="text-xs text-muted-foreground">
                      Mã: {store.code}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {mode === 'single' && currentStore?.id === store.id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
                {mode === 'multiple' && selectedStoreIds.includes(store.id) && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        {/* Manage Stores */}
        {showManageStores && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleManageStores}
              className="flex items-center space-x-3 p-3"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Quản lý cửa hàng</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
