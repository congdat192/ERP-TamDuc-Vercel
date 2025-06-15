
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
}

interface CustomerInfoTabProps {
  customer: Customer;
}

export function CustomerInfoTab({ customer }: CustomerInfoTabProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="theme-card rounded-lg border-2 theme-border-primary p-6 shadow-md hover:shadow-lg transition-all duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dòng 1: Avatar, Mã khách hàng, Tên khách hàng, Loại khách hàng */}
        <div className="space-y-2 flex flex-col items-center">
          <Avatar className="w-16 h-16 mb-2">
            <AvatarFallback className="theme-bg-primary text-white text-lg font-semibold">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <Label className="theme-text text-sm font-medium text-center">Ảnh đại diện</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-code" className="theme-text text-sm font-medium">Mã khách hàng</Label>
          <Input 
            id="customer-code"
            value={customer.id} 
            readOnly 
            className="voucher-input h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-name" className="theme-text text-sm font-medium">Tên khách hàng</Label>
          <Input 
            id="customer-name"
            value={customer.name} 
            className="voucher-input h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-type" className="theme-text text-sm font-medium">Loại khách hàng</Label>
          <Select defaultValue="individual">
            <SelectTrigger className="voucher-input h-9">
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
            <SelectTrigger className="voucher-input h-9">
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
          <Label htmlFor="phone" className="theme-text text-sm font-medium">Điện thoại</Label>
          <Input 
            id="phone"
            value={customer.phone} 
            className="voucher-input h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="theme-text text-sm font-medium">Email</Label>
          <Input 
            id="email"
            value={customer.email} 
            className="voucher-input h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook" className="theme-text text-sm font-medium">Facebook</Label>
          <Input 
            id="facebook"
            value={customer.facebook} 
            className="voucher-input h-9"
          />
        </div>

        {/* Dòng 3: Ngày sinh và 3 cột trống */}
        <div className="space-y-2">
          <Label htmlFor="birthday" className="theme-text text-sm font-medium">Ngày sinh</Label>
          <Input 
            id="birthday"
            value={customer.birthday} 
            className="voucher-input h-9"
          />
        </div>
        <div className="space-y-2">
          {/* Cột trống */}
        </div>
        <div className="space-y-2">
          {/* Cột trống */}
        </div>
        <div className="space-y-2">
          {/* Cột trống */}
        </div>

        {/* Dòng 4: Địa chỉ (span 4 cột) */}
        <div className="space-y-2 md:col-span-2 lg:col-span-4">
          <Label htmlFor="address" className="theme-text text-sm font-medium">Địa chỉ</Label>
          <Input 
            id="address"
            value={customer.address} 
            className="voucher-input h-9"
          />
        </div>

        {/* Dòng 5: Tên công ty, Mã số thuế, (2 cột trống) */}
        <div className="space-y-2">
          <Label htmlFor="company" className="theme-text text-sm font-medium">Tên công ty</Label>
          <Input 
            id="company"
            value={customer.company} 
            className="voucher-input h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax-code" className="theme-text text-sm font-medium">Mã số thuế</Label>
          <Input 
            id="tax-code"
            value={customer.taxCode} 
            className="voucher-input h-9"
          />
        </div>
        <div className="space-y-2">
          {/* Cột trống */}
        </div>
        <div className="space-y-2">
          {/* Cột trống */}
        </div>

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
    </div>
  );
}
