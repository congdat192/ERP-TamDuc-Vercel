import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  User, 
  Phone, 
  Receipt, 
  Copy, 
  Printer, 
  CheckCircle,
  AlertTriangle,
  Gift
} from 'lucide-react';

export function IssueVoucher() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerFound, setCustomerFound] = useState<any>(null);
  const [existingVoucher, setExistingVoucher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newVoucher, setNewVoucher] = useState<any>(null);
  const [formData, setFormData] = useState({
    customerSource: '',
    customerType: '',
    voucherValue: '',
    notes: ''
  });

  const handlePhoneSearch = async () => {
    if (!phoneNumber) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Simulate found customer
      const foundCustomer = {
        name: 'John Doe',
        phone: phoneNumber,
        email: 'john.doe@email.com',
        lastVoucher: '2024-01-15',
        totalVouchers: 3,
        type: 'Premium'
      };
      
      // Simulate existing active voucher
      const activeVoucher = {
        code: 'VCH-2024-001234',
        value: '$50',
        status: 'active',
        issueDate: '2024-01-20',
        expiryDate: '2024-02-20',
        issuedBy: 'Jane Smith'
      };
      
      setCustomerFound(foundCustomer);
      setExistingVoucher(Math.random() > 0.7 ? activeVoucher : null);
      setIsLoading(false);
    }, 1000);
  };

  const handleIssueVoucher = () => {
    if (!formData.customerSource || !formData.customerType || !formData.voucherValue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate voucher generation
    setTimeout(() => {
      const voucher = {
        code: `VCH-${Date.now()}`,
        value: formData.voucherValue,
        customer: customerFound?.name || 'New Customer',
        phone: phoneNumber,
        issueDate: new Date().toLocaleDateString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        issuedBy: 'John Smith'
      };
      
      setNewVoucher(voucher);
      setShowSuccess(true);
      setIsLoading(false);
      
      toast({
        title: "Voucher Issued Successfully!",
        description: `Voucher ${voucher.code} has been generated.`,
      });
    }, 1500);
  };

  const copyVoucherCode = () => {
    navigator.clipboard.writeText(newVoucher.code);
    toast({
      title: "Copied!",
      description: "Voucher code copied to clipboard.",
    });
  };

  const printVoucher = () => {
    toast({
      title: "Printing...",
      description: "Voucher is being sent to printer.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-blue-600" />
            <span>Issue New Voucher</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Search */}
          <div className="space-y-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <Label htmlFor="phone">Customer Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handlePhoneSearch}
                disabled={!phoneNumber || isLoading}
                className="mb-0"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Customer Info Display */}
            {customerFound && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customerFound.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{customerFound.phone}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="secondary">{customerFound.type} Customer</Badge>
                          <span className="text-xs text-gray-500">
                            {customerFound.totalVouchers} vouchers issued
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Voucher Warning */}
            {existingVoucher && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Active voucher found:</strong> {existingVoucher.code} ({existingVoucher.value}) 
                  expires on {existingVoucher.expiryDate}. 
                  <Button variant="link" className="p-0 h-auto text-orange-800 underline ml-1">
                    View details
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Voucher Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="source">Customer Source *</Label>
                <Select value={formData.customerSource} onValueChange={(value) => 
                  setFormData({...formData, customerSource: value})
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Customer Type *</Label>
                <Select value={formData.customerType} onValueChange={(value) => 
                  setFormData({...formData, customerType: value})
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Customer</SelectItem>
                    <SelectItem value="returning">Returning Customer</SelectItem>
                    <SelectItem value="premium">Premium Customer</SelectItem>
                    <SelectItem value="vip">VIP Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="value">Voucher Value *</Label>
                <Select value={formData.voucherValue} onValueChange={(value) => 
                  setFormData({...formData, voucherValue: value})
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$10">$10</SelectItem>
                    <SelectItem value="$25">$25</SelectItem>
                    <SelectItem value="$50">$50</SelectItem>
                    <SelectItem value="$75">$75</SelectItem>
                    <SelectItem value="$100">$100</SelectItem>
                    <SelectItem value="$150">$150</SelectItem>
                    <SelectItem value="$200">$200</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Issue Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
              size="lg"
              onClick={handleIssueVoucher}
              disabled={isLoading || !phoneNumber}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              <Receipt className="w-5 h-5 mr-2" />
              {isLoading ? 'Issuing Voucher...' : 'Issue Voucher'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span>Voucher Issued Successfully!</span>
            </DialogTitle>
          </DialogHeader>
          
          {newVoucher && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-mono font-bold text-green-800">
                    {newVoucher.code}
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    Value: {newVoucher.value}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{newVoucher.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{newVoucher.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-medium">{newVoucher.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className="font-medium">{newVoucher.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Issued By:</span>
                  <span className="font-medium">{newVoucher.issuedBy}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={copyVoucherCode}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={printVoucher}
                >
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
