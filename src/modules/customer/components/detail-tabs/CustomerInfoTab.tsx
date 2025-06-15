
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  return (
    <div className="space-y-6">
      {/* Thông tin cơ bản */}
      <div className="theme-card rounded-lg border theme-border-primary p-6">
        <h4 className="text-lg font-semibold theme-text mb-4">Thông tin cơ bản</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer-code" className="theme-text">Mã khách hàng</Label>
            <Input 
              id="customer-code"
              value={customer.id} 
              readOnly 
              className="voucher-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="theme-text">Tên khách hàng</Label>
            <Input 
              id="customer-name"
              value={customer.name} 
              className="voucher-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-type" className="theme-text">Loại khách hàng</Label>
            <Select defaultValue="individual">
              <SelectTrigger className="voucher-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Cá nhân</SelectItem>
                <SelectItem value="company">Công ty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-group" className="theme-text">Nhóm khách hàng</Label>
            <Select defaultValue={customer.group}>
              <SelectTrigger className="voucher-input">
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
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="theme-card rounded-lg border theme-border-primary p-6">
        <h4 className="text-lg font-semibold theme-text mb-4">Thông tin liên hệ</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="theme-text">Điện thoại</Label>
            <Input 
              id="phone"
              value={customer.phone} 
              className="voucher-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="theme-text">Email</Label>
            <Input 
              id="email"
              value={customer.email} 
              className="voucher-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook" className="theme-text">Facebook</Label>
            <Input 
              id="facebook"
              value={customer.facebook} 
              className="voucher-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthday" className="theme-text">Ngày sinh</Label>
            <Input 
              id="birthday"
              value={customer.birthday} 
              className="voucher-input"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="theme-text">Địa chỉ</Label>
            <Input 
              id="address"
              value={customer.address} 
              className="voucher-input"
            />
          </div>
        </div>
      </div>

      {/* Thông tin công ty */}
      <div className="theme-card rounded-lg border theme-border-primary p-6">
        <h4 className="text-lg font-semibold theme-text mb-4">Thông tin công ty</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="theme-text">Tên công ty</Label>
            <Input 
              id="company"
              value={customer.company} 
              className="voucher-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax-code" className="theme-text">Mã số thuế</Label>
            <Input 
              id="tax-code"
              value={customer.taxCode} 
              className="voucher-input"
            />
          </div>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="theme-card rounded-lg border theme-border-primary p-6">
        <h4 className="text-lg font-semibold theme-text mb-4">Ghi chú</h4>
        <Textarea 
          value={customer.note} 
          rows={4}
          className="voucher-input"
        />
      </div>
    </div>
  );
}
