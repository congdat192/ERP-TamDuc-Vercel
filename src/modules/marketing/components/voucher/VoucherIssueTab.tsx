import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Gift } from 'lucide-react';
import { voucherService, type VoucherIssueResponse } from '../../services/voucherService';
import { toast } from 'sonner';
import { VoucherDisplay } from './VoucherDisplay';

export function VoucherIssueTab() {
  const [phone, setPhone] = useState('');
  const [customerType, setCustomerType] = useState<string>('');
  const [source, setSource] = useState('');
  const [campaignId, setCampaignId] = useState('');
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  
  const [isValidating, setIsValidating] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [voucherResult, setVoucherResult] = useState<VoucherIssueResponse | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campaignsData, sourcesData] = await Promise.all([
        voucherService.getCampaigns(),
        voucherService.getSources()
      ]);
      setCampaigns(campaignsData);
      setSources(sourcesData);
    } catch (error) {
      toast.error('Không thể tải dữ liệu');
    }
  };

  const handleValidateCustomer = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    setIsValidating(true);
    try {
      const result = await voucherService.validateCustomer(phone);
      setCustomerType(result.data.customer_type);
      toast.success(`Xác định: ${result.data.customer_type === 'new' ? 'Khách mới' : 'Khách cũ'}`);
    } catch (error: any) {
      toast.error(error.message || 'Không thể xác định khách hàng');
    } finally {
      setIsValidating(false);
    }
  };

  const handleIssueVoucher = async () => {
    if (!phone || !campaignId || !source || !customerType) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsIssuing(true);
    try {
      const result = await voucherService.issueVoucher({
        phone,
        campaign_id: campaignId,
        source,
        customer_info: { customer_type: customerType }
      });
      
      setVoucherResult(result);
      toast.success('Phát hành voucher thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Không thể phát hành voucher');
    } finally {
      setIsIssuing(false);
    }
  };

  const handleReset = () => {
    setPhone('');
    setCustomerType('');
    setSource('');
    setCampaignId('');
    setVoucherResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Form */}
      <Card>
        <CardHeader>
          <CardTitle>Phát hành Voucher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phone Input */}
          <div className="space-y-2">
            <Label>Số điện thoại khách hàng *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="0912345678"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setCustomerType('');
                }}
              />
              <Button 
                onClick={handleValidateCustomer} 
                disabled={isValidating}
                size="icon"
              >
                {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Customer Type (Read-only) */}
          {customerType && (
            <Alert>
              <AlertDescription>
                <strong>Loại khách hàng:</strong> {customerType === 'new' ? '🆕 Khách mới' : '🔄 Khách cũ'}
              </AlertDescription>
            </Alert>
          )}

          {/* Source Selector */}
          <div className="space-y-2">
            <Label>Nguồn khách hàng *</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nguồn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((s) => (
                  <SelectItem key={s.id} value={s.source_code}>
                    {s.source_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Selector */}
          <div className="space-y-2">
            <Label>Chiến dịch Voucher *</Label>
            <Select value={campaignId} onValueChange={setCampaignId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chiến dịch" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.campaign_id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleIssueVoucher} 
              disabled={isIssuing || !customerType}
              className="flex-1"
            >
              {isIssuing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang phát hành...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Phát hành Voucher
                </>
              )}
            </Button>
            
            {voucherResult && (
              <Button variant="outline" onClick={handleReset}>
                Phát mới
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right: Voucher Result */}
      {voucherResult && (
        <VoucherDisplay voucherData={voucherResult.data} />
      )}
    </div>
  );
}
