
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye,
  Edit,
  Calendar,
  Phone,
  User
} from 'lucide-react';

const voucherData = [
  {
    id: 1,
    code: 'VCH-2024-001',
    customerName: 'Alice Johnson',
    customerPhone: '+1 (555) 123-4567',
    customerType: 'Premium',
    value: '$50',
    status: 'active',
    issuedBy: 'John Smith',
    issueDate: '2024-01-20',
    expiryDate: '2024-02-20',
    notes: 'First-time customer promotion'
  },
  {
    id: 2,
    code: 'VCH-2024-002',
    customerName: 'Bob Wilson',
    customerPhone: '+1 (555) 987-6543',
    customerType: 'Regular',
    value: '$25',
    status: 'used',
    issuedBy: 'Jane Doe',
    issueDate: '2024-01-19',
    expiryDate: '2024-02-19',
    notes: 'Referral bonus'
  },
  {
    id: 3,
    code: 'VCH-2024-003',
    customerName: 'Carol Davis',
    customerPhone: '+1 (555) 456-7890',
    customerType: 'VIP',
    value: '$100',
    status: 'active',
    issuedBy: 'Mike Brown',
    issueDate: '2024-01-18',
    expiryDate: '2024-02-18',
    notes: 'VIP loyalty reward'
  },
  {
    id: 4,
    code: 'VCH-2024-004',
    customerName: 'David Lee',
    customerPhone: '+1 (555) 321-0987',
    customerType: 'New',
    value: '$30',
    status: 'expired',
    issuedBy: 'Sarah Johnson',
    issueDate: '2024-01-01',
    expiryDate: '2024-01-15',
    notes: 'Welcome offer'
  },
  {
    id: 5,
    code: 'VCH-2024-005',
    customerName: 'Emma Thompson',
    customerPhone: '+1 (555) 654-3210',
    customerType: 'Premium',
    value: '$75',
    status: 'cancelled',
    issuedBy: 'Tom Wilson',
    issueDate: '2024-01-17',
    expiryDate: '2024-02-17',
    notes: 'Customer request cancellation'
  }
];

export function VoucherList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVouchers = voucherData.filter(voucher => {
    const matchesSearch = 
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;
    const matchesType = typeFilter === 'all' || voucher.customerType.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (voucher: any) => {
    setSelectedVoucher(voucher);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Voucher Management</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by code, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Customer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Voucher Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vouchers ({filteredVouchers.length})</span>
            <Badge variant="secondary">
              {filteredVouchers.filter(v => v.status === 'active').length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher Code</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued By</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((voucher) => (
                  <TableRow key={voucher.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono font-medium">
                      {voucher.code}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{voucher.customerName}</div>
                        <div className="text-sm text-gray-500">{voucher.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{voucher.customerType}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {voucher.value}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(voucher.status)}>
                        {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{voucher.issuedBy}</TableCell>
                    <TableCell>{voucher.issueDate}</TableCell>
                    <TableCell>{voucher.expiryDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(voucher)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Voucher Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Voucher Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedVoucher && (
            <div className="space-y-6">
              {/* Voucher Code Display */}
              <div className="bg-gray-50 border rounded-lg p-4 text-center">
                <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
                  {selectedVoucher.code}
                </div>
                <div className="text-xl font-semibold text-green-600">
                  Value: {selectedVoucher.value}
                </div>
                <Badge className={getStatusColor(selectedVoucher.status)} variant="secondary">
                  {selectedVoucher.status.charAt(0).toUpperCase() + selectedVoucher.status.slice(1)}
                </Badge>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedVoucher.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedVoucher.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge variant="outline">{selectedVoucher.customerType}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Voucher Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued By:</span>
                      <span className="font-medium">{selectedVoucher.issuedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issue Date:</span>
                      <span className="font-medium">{selectedVoucher.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span className="font-medium">{selectedVoucher.expiryDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedVoucher.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedVoucher.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Notes
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
