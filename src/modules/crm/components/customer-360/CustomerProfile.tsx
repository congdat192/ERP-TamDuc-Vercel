import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone, Star, User } from 'lucide-react';
import { CRMCustomerDetail } from '../../types/crm';

interface CustomerProfileProps {
    customer: CRMCustomerDetail;
}

export function CustomerProfile({ customer }: CustomerProfileProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin Khách hàng
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={customer.customer_avatar} alt={customer.customer_name} />
                        <AvatarFallback className="text-xl">{customer.customer_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{customer.customer_name}</h3>
                    <p className="text-gray-500">{customer.customer_phone}</p>
                    <div className="mt-2">
                        <Badge variant={customer.rank === 'VIP' ? 'default' : 'secondary'}>
                            {customer.rank || 'Thành viên'}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{customer.customer_phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{customer.email || 'Chưa cập nhật email'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{customer.address || 'Chưa cập nhật địa chỉ'}</span>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Tổng chi tiêu</span>
                        <span className="font-bold text-green-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.total_spent || 0)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Hạng thành viên</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium">{customer.rank || 'Standard'}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
