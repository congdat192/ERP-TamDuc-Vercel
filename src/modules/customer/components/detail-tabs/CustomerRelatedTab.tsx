import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { RelatedCustomerCard } from '../related-customers/RelatedCustomerCard';
import { AddRelatedCustomerModal } from '../related-customers/AddRelatedCustomerModal';
import { RelatedCustomerDetailDialog } from '../related-customers/RelatedCustomerDetailDialog';
import { RelatedCustomerService } from '../../services/relatedCustomerService';
import { RelatedCustomer } from '../../types/relatedCustomer.types';
import { useToast } from '@/hooks/use-toast';
import { mapFamilyMembersToRelated, fetchCustomerByPhone } from '../../services/customerService';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomerRelatedTabProps {
  customer: any;
  currentUser: any;
  refreshTrigger?: number;
}

export function CustomerRelatedTab({ customer, currentUser, refreshTrigger }: CustomerRelatedTabProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [relatedCustomers, setRelatedCustomers] = useState<RelatedCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRelated, setSelectedRelated] = useState<RelatedCustomer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchRelatedCustomers = async () => {
    if (!customer?.phone) {
      setError('Không tìm thấy số điện thoại khách hàng');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // ✅ Ưu tiên hiển thị family_members từ API response
      if (customer.familyMembers && customer.familyMembers.length > 0) {
        console.log('[CustomerRelatedTab] Using family_members from API:', customer.familyMembers.length);
        
        // Map family_members sang RelatedCustomer format
        const mappedData = mapFamilyMembersToRelated(customer.familyMembers, {
          contactnumber: customer.phone,
          code: customer.customerCode || customer.id,
          name: customer.customerName || customer.name,
          groups: customer.group || customer.customerGroup
        });
        
        setRelatedCustomers(mappedData);
        setIsLoading(false);
        return;
      }
      
      // ⚠️ Fallback: Nếu không có family_members, fetch từ Supabase (như cũ)
      console.log('[CustomerRelatedTab] No family_members, fetching from Supabase');
      const data = await RelatedCustomerService.getRelatedByCustomerPhone(customer.phone);
      setRelatedCustomers(data);
    } catch (err: any) {
      console.error('Error fetching related customers:', err);
      setError(err.message || 'Không thể tải danh sách người thân');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCustomerData = async () => {
    if (!customer?.phone) return;

    setIsLoading(true);
    try {
      console.log('[CustomerRelatedTab] Refreshing customer data from API...');
      
      // Re-fetch customer data từ External API
      const response = await fetchCustomerByPhone(customer.phone);
      
      if (!response?.success || !response.data) {
        throw new Error('Không thể tải dữ liệu khách hàng');
      }

      // Map family_members mới nhất
      const familyMembers = response.data.family_members || [];
      console.log('[CustomerRelatedTab] Refreshed family members:', familyMembers.length);
      
      const mappedData = mapFamilyMembersToRelated(familyMembers, {
        contactnumber: customer.phone,
        code: customer.customerCode || customer.id,
        name: customer.customerName || customer.name,
        groups: customer.group || customer.customerGroup
      });
      
      setRelatedCustomers(mappedData);
    } catch (error: any) {
      console.error('Error refreshing customer data:', error);
      toast({
        title: '❌ Lỗi',
        description: error.message || 'Không thể refresh dữ liệu',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatedCustomers();
  }, [customer?.phone, customer?.familyMembers]);

  // Handle manual refresh from parent
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      console.log('[CustomerRelatedTab] Manual refresh triggered:', refreshTrigger);
      refreshCustomerData();
    }
  }, [refreshTrigger]);

  const handleViewRelated = (related: RelatedCustomer) => {
    setSelectedRelated(related);
    setIsDetailOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refreshCustomerData();
  };

  return (
    <div className="theme-card rounded-lg border-2 theme-border-primary p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold theme-text">
          👥 Danh sách người thân ({relatedCustomers.length})
        </h3>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className={`gap-2 ${isMobile ? "min-h-[44px] touch-manipulation" : ""}`}
          size="sm"
        >
          <Plus className="w-4 h-4" />
          {!isMobile && "Thêm người thân"}
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin theme-text-muted" />
          <p className="theme-text-muted">Đang tải danh sách người thân...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-red-500 font-medium">{error}</p>
          <Button variant="outline" onClick={fetchRelatedCustomers}>
            Thử lại
          </Button>
        </div>
      ) : relatedCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="text-6xl">👥</div>
          <p className="theme-text-muted text-center">
            Chưa có người thân nào được thêm
          </p>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm người thân đầu tiên
          </Button>
        </div>
      ) : (
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
          {relatedCustomers.map((related) => (
            <RelatedCustomerCard
              key={related.id}
              related={related}
              onView={handleViewRelated}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddRelatedCustomerModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        customer={customer}
        currentUser={currentUser}
        onSuccess={handleAddSuccess}
      />

      {/* Detail Dialog */}
      <RelatedCustomerDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        related={selectedRelated}
        customer={customer}
        currentUser={currentUser}
        onUpdate={refreshCustomerData}
      />
    </div>
  );
}
