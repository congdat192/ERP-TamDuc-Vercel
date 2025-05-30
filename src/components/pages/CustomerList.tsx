
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Phone,
  Mail,
  Calendar,
  Receipt,
  Gift,
  Plus
} from 'lucide-react';

const customerData = [
  {
    id: 1,
    name: 'Alice Johnson',
    phone: '+1 (555) 123-4567',
    email: 'alice.johnson@email.com',
    type: 'Premium',
    joinDate: '2024-01-15',
    totalVouchers: 5,
    lastVoucher: '2024-01-20',
    totalSpent: '$425',
    status: 'active',
    notes: 'VIP customer, prefers phone contact'
  },
  {
    id: 2,
    name: 'Bob Wilson',
    phone: '+1 (555) 987-6543',
    email: 'bob.wilson@email.com',
    type: 'Regular',
    joinDate: '2024-01-10',
    totalVouchers: 3,
    lastVoucher: '2024-01-19',
    totalSpent: '$275',
    status: 'active',
    notes: 'Prefers email communication'
  },
  {
    id: 3,
    name: 'Carol Davis',
    phone: '+1 (555) 456-7890',
    email: 'carol.davis@email.com',
    type: 'VIP',
    joinDate: '2023-12-20',
    totalVouchers: 12,
    lastVoucher: '2024-01-18',
    totalSpent: '$1,250',
    status: 'active',
    notes: 'High-value customer, quick decision maker'
  },
  {
    id: 4,
    name: 'David Lee',
    phone: '+1 (555) 321-0987',
    email: 'david.lee@email.com',
    type: 'New',
    joinDate: '2024-01-01',
    totalVouchers: 1,
    lastVoucher: '2024-01-01',
    totalSpent: '$50',
    status: 'inactive',
    notes: 'First-time customer, needs follow-up'
  },
  {
    id: 5,
    name: 'Emma Thompson',
    phone: '+1 (555) 654-3210',
    email: 'emma.thompson@email.com',
    type: 'Premium',
    joinDate: '2023-11-15',
    totalVouchers: 8,
    lastVoucher: '2024-01-17',
    totalSpent: '$720',
    status: 'active',
    notes: 'Loyal customer, responds well to promotions'
  }
];

export function CustomerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Premium':
        return 'bg-blue-100 text-blue-800';
      case 'Regular':
        return 'bg-green-100 text-green-800';
      case 'New':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const filteredCustomers = customerData.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || customer.type.toLowerCase() === typeFilter;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Management</span>
            <div className="flex space-x-2">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
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
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerData.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerData.filter(c => c.type === 'VIP').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Plus className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerData.filter(c => c.type === 'New').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customers ({filteredCustomers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Vouchers</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(customer.type)}>
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.joinDate}</TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium">{customer.totalVouchers}</div>
                      <div className="text-xs text-gray-500">Last: {customer.lastVoucher}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {customer.totalSpent}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Gift className="w-4 h-4" />
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

      {/* Customer Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Customer Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge className={getTypeColor(selectedCustomer.type)}>
                      {selectedCustomer.type}
                    </Badge>
                    <Badge className={getStatusColor(selectedCustomer.status)}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Joined: {selectedCustomer.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Purchase History</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Vouchers:</span>
                      <span className="font-medium">{selectedCustomer.totalVouchers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium text-green-600">{selectedCustomer.totalSpent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Voucher:</span>
                      <span className="font-medium">{selectedCustomer.lastVoucher}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedCustomer.notes}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  Issue Voucher
                </Button>
                <Button>
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
