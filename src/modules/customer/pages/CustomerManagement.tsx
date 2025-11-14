import { useState } from "react";
import { fetchCustomerByPhone, mapCustomerData } from "../services/customerService";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsMobileDevice } from "@/hooks/use-device-type";
import { CustomerSearchActions } from "../components/CustomerSearchActions";
import { CustomerFilters } from "../components/CustomerFilters";
import { CustomerTable } from "../components/CustomerTable";
import { CustomerSummaryCard } from "../components/CustomerSummaryCard";
import { FullScreenCustomerDetail } from "../components/FullScreenCustomerDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColumnConfig } from "../components/ColumnVisibilityFilter";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerManagementProps {
  currentUser?: any;
  onBackToModules?: () => void;
}

export function CustomerManagement({ currentUser, onBackToModules }: CustomerManagementProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiCustomerData, setApiCustomerData] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showFullScreenDetail, setShowFullScreenDetail] = useState(false);

  // Only use API data, no mockup
  const customers = apiCustomerData;

  // Đầy đủ 27 cột khách hàng
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "customerCode", label: "Mã khách hàng", visible: true },
    { key: "customerName", label: "Tên khách hàng", visible: true },
    { key: "customerType", label: "Loại khách hàng", visible: true },
    { key: "phone", label: "Điện thoại", visible: true },
    { key: "customerGroup", label: "Nhóm khách hàng", visible: true },
    { key: "gender", label: "Giới tính", visible: false },
    { key: "birthDate", label: "Ngày sinh", visible: false },
    { key: "email", label: "Email", visible: false },
    { key: "facebook", label: "Facebook", visible: false },
    { key: "company", label: "Công ty", visible: false },
    { key: "taxCode", label: "Mã số thuế", visible: false },
    { key: "idNumber", label: "Số CCCD/CMND", visible: false },
    { key: "address", label: "Địa chỉ", visible: false },
    { key: "deliveryArea", label: "Khu vực giao hàng", visible: false },
    { key: "ward", label: "Phường/Xã", visible: false },
    { key: "creator", label: "Người tạo", visible: false },
    { key: "createDate", label: "Ngày tạo", visible: false },
    { key: "notes", label: "Ghi chú", visible: false },
    { key: "lastTransactionDate", label: "Ngày giao dịch cuối", visible: false },
    { key: "createBranch", label: "Chi nhánh tạo", visible: false },
    { key: "currentDebt", label: "Nợ hiện tại", visible: false },
    { key: "debtDays", label: "Số ngày nợ", visible: false },
    { key: "totalSales", label: "Tổng bán", visible: true },
    { key: "currentPoints", label: "Điểm hiện tại", visible: false },
    { key: "totalPoints", label: "Tổng điểm", visible: false },
    { key: "totalSalesMinusReturns", label: "Tổng bán trừ trả hàng", visible: false },
    { key: "status", label: "Trạng thái", visible: false },
  ]);

  const isMobile = useIsMobile();
  const isMobileDevice = useIsMobileDevice();

  // Get visible columns
  const visibleColumns = columns.filter((col) => col.visible);

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns((prev) => prev.map((col) => (col.key === columnKey ? { ...col, visible } : col)));
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomers((prev) => prev.filter((id) => id !== customerId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageData = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setSelectedCustomers(currentPageData.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSearch = async () => {
    // Check if search term looks like a phone number
    const isPhoneNumber = /^[\d\s\-\+\(\)]+$/.test(searchTerm.trim());

    if (isPhoneNumber && searchTerm.trim()) {
      setIsLoadingApi(true);
      try {
        const response = await fetchCustomerByPhone(searchTerm);

        if (response && response.success && response.data) {
          const mappedCustomer = mapCustomerData(response.data);
          setApiCustomerData([mappedCustomer]);
          setCurrentPage(1);
          toast({
            title: "Thành công",
            description: `Tìm thấy khách hàng: ${response.data.name}`,
          });
        } else {
          setApiCustomerData([]);
          toast({
            title: "Không tìm thấy",
            description: "Không tìm thấy khách hàng với số điện thoại này",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin khách hàng",
          variant: "destructive",
        });
      } finally {
        setIsLoadingApi(false);
      }
    }
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setApiCustomerData([]);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setIsFilterOpen(false);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
    setShowFullScreenDetail(true);
  };

  const handleCloseDetail = () => {
    setShowFullScreenDetail(false);
    setSelectedCustomer(null);
  };

  const totalCustomers = customers.length;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  return (
    <div className="flex flex-col h-screen overflow-hidden theme-background pt-3 sm:pt-6">
      {/* Main Content Layout - Takes remaining height */}
      <div className="flex flex-1 min-h-0 px-3 sm:px-6 pb-3 sm:pb-6 gap-2 sm:gap-3">
        {/* Main Content Area - Full width */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Search & Actions Bar - Fixed height */}
          <div className="flex-shrink-0">
            <CustomerSearchActions
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              onResetSearch={handleResetSearch}
              isLoadingApi={isLoadingApi}
              columns={columns}
              handleColumnToggle={handleColumnToggle}
              onToggleSidebar={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>

          {/* Empty State when no search performed */}
          {customers.length === 0 && !isLoadingApi && (
            <div className="flex-1 min-h-0 flex items-center justify-center theme-card rounded-lg border theme-border-primary p-4 sm:p-8">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold theme-text">Tìm kiếm khách hàng</h3>
                  <p className="text-xs sm:text-sm theme-text-muted max-w-md px-4">
                    Nhập số điện thoại khách hàng vào ô tìm kiếm để tra cứu thông tin chi tiết
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile/Tablet: Summary Cards */}
          {customers.length > 0 && isMobileDevice && (
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-3 pb-4">
                  {customers
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((customer) => (
                      <CustomerSummaryCard
                        key={customer.id}
                        customer={customer}
                        onClick={handleCustomerClick}
                      />
                    ))}
                </div>
                
                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Trước
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      {currentPage} / {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Desktop: Customer Table */}
          {customers.length > 0 && !isMobileDevice && (
            <div className="flex-1 min-h-0">
              <CustomerTable
                customers={customers}
                visibleColumns={visibleColumns}
                selectedCustomers={selectedCustomers}
                handleSelectCustomer={handleSelectCustomer}
                handleSelectAll={handleSelectAll}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalCustomers={totalCustomers}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Customer Detail Modal (Mobile/Tablet Only) */}
      {showFullScreenDetail && selectedCustomer && isMobileDevice && (
        <FullScreenCustomerDetail
          customer={selectedCustomer}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
