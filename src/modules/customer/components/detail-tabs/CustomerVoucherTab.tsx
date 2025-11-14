import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, History, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { VoucherCard } from "../voucher/VoucherCard";
import { AvailableCampaignCard } from "../voucher/AvailableCampaignCard";
import { VoucherDetailDialog } from "../voucher/VoucherDetailDialog";
import { ClaimVoucherDialog } from "../voucher/ClaimVoucherDialog";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  VoucherEligibilityResponse,
  ReceivedVoucher,
  AvailableCampaign,
  VoucherHistoryResponse,
  VoucherHistoryItem,
  voucherService,
} from "../../services/voucherService";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomerVoucherTabProps {
  customerPhone: string;
  voucherData: VoucherEligibilityResponse | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function CustomerVoucherTab({
  customerPhone,
  voucherData,
  isLoading,
  error,
  onRefresh,
}: CustomerVoucherTabProps) {
  const isMobile = useIsMobile();
  const [selectedVoucher, setSelectedVoucher] = useState<ReceivedVoucher | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<AvailableCampaign | null>(null);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // History state
  const [historyData, setHistoryData] = useState<VoucherHistoryResponse | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!customerPhone) return;

      setIsLoadingHistory(true);
      setHistoryError(null);

      try {
        const data = await voucherService.getVoucherHistory(
          customerPhone,
          currentPage,
          20,
          statusFilter === "all" ? undefined : statusFilter,
        );
        setHistoryData(data);
      } catch (err) {
        console.error("Error fetching voucher history:", err);
        setHistoryError(err instanceof Error ? err.message : "Lỗi khi tải lịch sử voucher");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [customerPhone, currentPage, statusFilter]);

  const handleVoucherClick = (voucher: ReceivedVoucher) => {
    setSelectedVoucher(voucher);
    setIsDetailDialogOpen(true);
  };

  const handleClaimClick = (campaign: AvailableCampaign) => {
    setSelectedCampaign(campaign);
    setIsClaimDialogOpen(true);
  };

  const handleClaimConfirm = async () => {
    if (!selectedCampaign) return;

    setIsClaiming(true);
    try {
      const result = await voucherService.claimVoucher(customerPhone, selectedCampaign.campaign_id);

      if (result.success) {
        toast.success(`Đã nhận voucher ${result.voucher.code} thành công!`);
        setIsClaimDialogOpen(false);
        setSelectedCampaign(null);
        // Refresh voucher data
        onRefresh();
      } else {
        toast.error("Không thể nhận voucher");
      }
    } catch (err) {
      console.error("Error claiming voucher:", err);
      toast.error(err instanceof Error ? err.message : "Lỗi khi nhận voucher");
    } finally {
      setIsClaiming(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      da_kich_hoat: { variant: "default", label: "Đã kích hoạt" },
      da_su_dung: { variant: "secondary", label: "Đã sử dụng" },
      het_han: { variant: "destructive", label: "Hết hạn" },
      da_huy: { variant: "outline", label: "Đã hủy" },
    };
    const config = statusConfig[status] || { variant: "outline", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Voucher Khả Dụng */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 theme-text-primary" />
            <h3 className="text-lg font-semibold theme-text">Voucher Khả Dụng</h3>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>

        {/* Voucher Đã Nhận */}
        {voucherData?.received_vouchers && voucherData.received_vouchers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium theme-text-muted">
              Voucher Đã Nhận ({voucherData.received_vouchers.length})
            </h4>
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
              {voucherData.received_vouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} onClick={() => handleVoucherClick(voucher)} />
              ))}
            </div>
          </div>
        )}

        {/* Chiến Dịch Có Thể Nhận */}
        {voucherData?.available_campaigns && voucherData.available_campaigns.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium theme-text-muted">
              Chiến Dịch Có Thể Nhận ({voucherData.available_campaigns.length})
            </h4>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
              {voucherData.available_campaigns.map((campaign) => (
                <AvailableCampaignCard
                  key={campaign.campaign_id}
                  campaign={campaign}
                  onClaim={() => handleClaimClick(campaign)}
                  isLoading={isClaiming && selectedCampaign?.campaign_id === campaign.campaign_id}
                />
              ))}
            </div>
          </div>
        )}

        {(!voucherData?.received_vouchers || voucherData.received_vouchers.length === 0) &&
          (!voucherData?.available_campaigns || voucherData.available_campaigns.length === 0) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Khách hàng chưa có voucher nào hoặc không đủ điều kiện nhận voucher mới.
              </AlertDescription>
            </Alert>
          )}
      </div>

      <Separator />

      {/* Section 2: Lịch Sử Voucher */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 theme-text-primary" />
          <h3 className="text-lg font-semibold theme-text">Lịch Sử Voucher</h3>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className={`w-[200px] ${isMobile ? "min-h-[44px] touch-manipulation" : ""}`}>
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="da_kich_hoat">Đã kích hoạt</SelectItem>
              <SelectItem value="da_su_dung">Đã sử dụng</SelectItem>
              <SelectItem value="het_han">Hết hạn</SelectItem>
              <SelectItem value="da_huy">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          {statusFilter && statusFilter !== "all" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setStatusFilter("all")}
              className={isMobile ? "min-h-[44px] touch-manipulation" : ""}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* History Table */}
        {isLoadingHistory ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : historyError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{historyError}</AlertDescription>
          </Alert>
        ) : historyData?.data?.vouchers && historyData.data.vouchers.length > 0 ? (
          <>
            {isMobile ? (
              <div className="space-y-3">
                {historyData.data.vouchers.map((item: VoucherHistoryItem) => (
                  <div key={item.id} className="theme-card rounded-lg border theme-border-primary overflow-hidden">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-mono font-semibold text-base">{item.voucher_code}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.campaign_name}
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <span className="text-base">📅</span> Ngày nhận
                          </span>
                          <span>{formatDate(item.received_at)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <span className="text-base">⏰</span> Hạn dùng
                          </span>
                          <span>{formatDate(item.expires_at)}</span>
                        </div>
                        {item.used_at && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <span className="text-base">✅</span> Ngày dùng
                            </span>
                            <span>{formatDate(item.used_at)}</span>
                          </div>
                        )}
                        {item.invoice_used_voucher && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <span className="text-base">🧾</span> Hóa đơn
                            </span>
                            <span className="font-mono text-xs">{item.invoice_used_voucher}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b theme-border-primary/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase">Mã Voucher</th>
                        <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase">Chiến dịch</th>
                        <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase">Ngày nhận</th>
                        <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase">Hạn dùng</th>
                        <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase">Ngày dùng</th>
                        <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase">Hóa đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.data.vouchers.map((item: VoucherHistoryItem) => (
                        <tr key={item.id} className="border-b theme-border-primary/10 hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono font-medium">{item.voucher_code}</td>
                          <td className="px-4 py-3">{item.campaign_name}</td>
                          <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                          <td className="px-4 py-3">{formatDate(item.received_at)}</td>
                          <td className="px-4 py-3">{formatDate(item.expires_at)}</td>
                          <td className="px-4 py-3">{item.used_at ? formatDate(item.used_at) : "-"}</td>
                          <td className="px-4 py-3">{item.invoice_used_voucher || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {historyData.data.pagination && historyData.data.pagination.total_pages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm theme-text-muted">
                  Hiển thị {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, historyData.data.pagination.total)}{" "}
                  trong tổng số {historyData.data.pagination.total} voucher
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={
                          !historyData.data.pagination.has_prev ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {[...Array(historyData.data.pagination.total_pages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(historyData.data.pagination.total_pages, p + 1))}
                        className={
                          !historyData.data.pagination.has_next ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Chưa có lịch sử voucher</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Dialogs */}
      <VoucherDetailDialog voucher={selectedVoucher} open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} />

      <ClaimVoucherDialog
        campaign={selectedCampaign}
        open={isClaimDialogOpen}
        onOpenChange={setIsClaimDialogOpen}
        onConfirm={handleClaimConfirm}
        isLoading={isClaiming}
      />
    </div>
  );
}
