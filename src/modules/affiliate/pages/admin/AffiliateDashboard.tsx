
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AffiliateStats } from '../../components/AffiliateStats';
import { ReferrerTable } from '../../components/ReferrerTable';
import { AffiliateService } from '../../services/affiliateService';
import { ReferrerAccount, AffiliateStats as AffiliateStatsType } from '../../types';
import { Search, Plus, Download, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AffiliateDashboard() {
  const [stats, setStats] = useState<AffiliateStatsType | null>(null);
  const [referrers, setReferrers] = useState<ReferrerAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsData, referrersData] = await Promise.all([
        AffiliateService.getAffiliateStats(),
        AffiliateService.getReferrers()
      ]);
      
      setStats(statsData);
      setReferrers(referrersData);
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu affiliate',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await AffiliateService.updateReferrerStatus(id, status);
      
      // Update local state
      setReferrers(prev => 
        prev.map(referrer => 
          referrer.id === id ? { ...referrer, status } : referrer
        )
      );

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật trạng thái F0',
      });
    } catch (error) {
      console.error('Error updating referrer status:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái F0',
        variant: 'destructive'
      });
    }
  };

  const handleViewDetails = (referrer: ReferrerAccount) => {
    // TODO: Implement detail view
    console.log('View details for:', referrer);
  };

  const filteredReferrers = referrers.filter(referrer =>
    referrer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referrer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referrer.phone.includes(searchTerm) ||
    referrer.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold theme-text">Quản Lý Affiliate</h1>
          <p className="theme-text-muted">Quản lý hệ thống F0 và theo dõi hiệu suất</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất Báo Cáo
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm F0 Mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && <AffiliateStats stats={stats} />}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 theme-text-muted" />
          <Input
            placeholder="Tìm kiếm theo tên, email, SĐT hoặc mã giới thiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Bộ Lọc
        </Button>
      </div>

      {/* Referrers Table */}
      <ReferrerTable
        referrers={filteredReferrers}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
