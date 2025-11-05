import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { RelatedCustomerCard } from '../related-customers/RelatedCustomerCard';
import { AddRelatedCustomerModal } from '../related-customers/AddRelatedCustomerModal';
import { RelatedCustomerDetailDialog } from '../related-customers/RelatedCustomerDetailDialog';
import { RelatedCustomerService } from '../../services/relatedCustomerService';
import { RelatedCustomer } from '../../types/relatedCustomer.types';
import { useToast } from '@/hooks/use-toast';

interface CustomerRelatedTabProps {
  customer: any;
  currentUser: any;
}

export function CustomerRelatedTab({ customer, currentUser }: CustomerRelatedTabProps) {
  const { toast } = useToast();
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
      const data = await RelatedCustomerService.getRelatedByCustomerPhone(customer.phone);
      setRelatedCustomers(data);
    } catch (err: any) {
      console.error('Error fetching related customers:', err);
      setError(err.message || 'Không thể tải danh sách người thân');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatedCustomers();
  }, [customer?.phone]);

  const handleViewRelated = (related: RelatedCustomer) => {
    setSelectedRelated(related);
    setIsDetailOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchRelatedCustomers();
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
          className="gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Thêm người thân
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        onUpdate={fetchRelatedCustomers}
      />
    </div>
  );
}
