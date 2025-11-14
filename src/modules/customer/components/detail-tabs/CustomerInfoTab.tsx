
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ZoomIn, User, Phone, MapPin, Building2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  phone: string;
  group: string;
  birthday: string;
  creator: string;
  createdDate: string;
  note: string;
  email: string;
  facebook: string;
  company: string;
  taxCode: string;
  address: string;
  deliveryArea: string;
  points: number;
  totalSpent: number;
  totalDebt: number;
  status: string;
  gender: string;
  avatarUrl?: string;
}

interface CustomerInfoTabProps {
  customer: Customer;
}

export function CustomerInfoTab({ customer }: CustomerInfoTabProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'NA';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="col-span-full pt-6 first:pt-0">
      <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
        <Icon className="w-5 h-5" />
        {title}
      </h3>
      <div className="h-px bg-gradient-to-r from-primary/50 to-transparent mb-4" />
    </div>
  );

  return (
    <div className="theme-card rounded-lg border-2 theme-border-primary p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200">
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      )}>
        {/* Section: Thông tin cơ bản */}
        {isMobile && <SectionHeader icon={User} title="Thông tin cơ bản" />}

        {/* Dòng 1: Avatar, Mã khách hàng, Tên khách hàng, Loại khách hàng */}
        <div className="space-y-2 flex flex-col items-center sm:items-start">
          <div 
            className="relative group cursor-pointer"
            onClick={() => customer.avatarUrl && setIsZoomOpen(true)}
          >
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg ring-2 ring-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:ring-4 group-hover:ring-blue-300">
              {customer.avatarUrl && (
                <AvatarImage 
                  src={customer.avatarUrl} 
                  alt={customer.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="theme-bg-primary text-white text-lg font-semibold">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            
            {customer.avatarUrl && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <Label className="theme-text text-sm font-medium text-center">Ảnh đại diện</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-code" className="theme-text text-sm font-semibold">Mã khách hàng</Label>
          <Input 
            id="customer-code"
            value={customer.id} 
            readOnly 
            className={cn("voucher-input bg-muted", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-name" className="theme-text text-sm font-semibold">Tên khách hàng</Label>
          <Input 
            id="customer-name"
            value={customer.name} 
            className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-type" className="theme-text text-sm font-semibold">Loại khách hàng</Label>
          <Select defaultValue="individual">
            <SelectTrigger className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Cá nhân</SelectItem>
              <SelectItem value="company">Công ty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dòng 2: Nhóm khách hàng, Điện thoại, Email, Facebook */}
        <div className="space-y-2">
          <Label htmlFor="customer-group" className="theme-text text-sm font-medium">Nhóm khách hàng</Label>
          <Select defaultValue={customer.group}>
            <SelectTrigger className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Thường">Thường</SelectItem>
              <SelectItem value="Bán sỉ">Bán sỉ</SelectItem>
              <SelectItem value="Khách lẻ">Khách lẻ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="theme-text text-sm font-semibold">Điện thoại</Label>
          <Input 
            id="phone"
            value={customer.phone} 
            className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="theme-text text-sm font-semibold">Email</Label>
          <Input 
            id="email"
            value={customer.email} 
            className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook" className="theme-text text-sm font-semibold">Facebook</Label>
          <Input 
            id="facebook"
            value={customer.facebook} 
            className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>

        {/* Dòng 3: Ngày sinh, Ngày tạo, Người tạo, Giới tính */}
        <div className="space-y-2">
          <Label htmlFor="birthday" className="theme-text text-sm font-semibold">Ngày sinh</Label>
          <Input 
            id="birthday"
            value={customer.birthday} 
            className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="created-date" className="theme-text text-sm font-semibold">Ngày tạo</Label>
          <Input 
            id="created-date"
            value={customer.createdDate} 
            readOnly
            className={cn("voucher-input bg-muted", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="creator" className="theme-text text-sm font-semibold">Người tạo</Label>
          <Input 
            id="creator"
            value={customer.creator} 
            readOnly
            className={cn("voucher-input bg-muted", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender" className="theme-text text-sm font-semibold">Giới tính</Label>
          <Select defaultValue={customer.gender}>
            <SelectTrigger className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nam">Nam</SelectItem>
              <SelectItem value="Nữ">Nữ</SelectItem>
              <SelectItem value="Khác">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Separator for mobile */}
        {isMobile && <div className="col-span-full h-px bg-gray-200 my-2" />}

        {/* Section: Địa chỉ */}
        {isMobile && <SectionHeader icon={MapPin} title="Địa chỉ" />}

        {/* Dòng 4: Địa chỉ (span 4 cột) */}
        <div className={cn("space-y-2", !isMobile && "md:col-span-2 lg:col-span-4")}>
          <Label htmlFor="address" className="theme-text text-sm font-semibold">Địa chỉ</Label>
          <Input 
            id="address"
            value={customer.address} 
            className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>

        {/* Separator for mobile */}
        {isMobile && <div className="col-span-full h-px bg-gray-200 my-2" />}

        {/* Section: Thông tin công ty */}
        {isMobile && <SectionHeader icon={Building2} title="Thông tin công ty" />}

        {/* Dòng 5: Tên công ty, Mã số thuế, Chi nhánh, (1 cột trống) */}
        <div className="space-y-2">
          <Label htmlFor="company" className="theme-text text-sm font-semibold">Tên công ty</Label>
          <Input 
            id="company"
            value={customer.company} 
            className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax-code" className="theme-text text-sm font-semibold">Mã số thuế</Label>
          <Input 
            id="tax-code"
            value={customer.taxCode} 
            className={cn("voucher-input", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch" className="theme-text text-sm font-semibold">Chi nhánh</Label>
          <Input 
            id="branch"
            value="Chi nhánh HCM" 
            readOnly
            className={cn("voucher-input bg-muted", isMobile && "min-h-[44px] text-[15px]")}
          />
        </div>
        {!isMobile && (
          <div className="space-y-2">
            {/* Cột trống */}
          </div>
        )}

        {/* Dòng 6: Ghi chú (span 4 cột) */}
        <div className="space-y-2 md:col-span-2 lg:col-span-4">
          <Label htmlFor="note" className="theme-text text-sm font-medium">Ghi chú</Label>
          <Textarea 
            id="note"
            value={customer.note} 
            rows={3}
            className="voucher-input"
          />
        </div>
      </div>

      {/* Zoom Dialog */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-3xl">
          <div className="flex flex-col items-center space-y-4 p-4">
            {customer.avatarUrl ? (
              <div className="relative overflow-hidden rounded-xl shadow-2xl border-4 border-white">
                <img
                  src={customer.avatarUrl}
                  alt={customer.name}
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                />
              </div>
            ) : (
              <div className="w-64 h-64 rounded-xl shadow-2xl border-4 border-white theme-bg-primary flex items-center justify-center">
                <span className="text-white text-6xl font-semibold">
                  {getInitials(customer.name)}
                </span>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-xl font-semibold theme-text">{customer.name}</h3>
              <p className="text-sm theme-text-muted">{customer.phone}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
