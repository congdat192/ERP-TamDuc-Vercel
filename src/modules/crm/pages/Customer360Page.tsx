import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Phone, Mail, MapPin, Tag, Plus } from 'lucide-react';
import { crmService } from '../services/crmService';
import { ActivityTimeline } from '../components/customer-360/ActivityTimeline';
import { CustomerProfile } from '../components/customer-360/CustomerProfile';
import { AISuggestion } from '../components/shared/AISuggestion';
import { PrescriptionChart } from '../components/customer/PrescriptionChart';
import { PrescriptionHistory } from '../components/customer/PrescriptionHistory';
import { FamilyMembers } from '../components/customer/FamilyMembers';
import { CRMCustomerDetail } from '../types/crm';
import { CRMNavigation } from '../components/shared/CRMNavigation';

export function Customer360Page() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<CRMCustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCustomer = async () => {
            if (id) {
                const data = await crmService.getCustomerDetails(Number(id));
                setCustomer(data as any);
                setLoading(false);
            }
        };
        loadCustomer();
    }, [id]);

    if (loading || !customer) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <CRMNavigation />
            <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/crm/customer')}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">{customer.customer_name}</h1>
                                <div className="flex gap-2">
                                    {customer.customer_tags?.map(tag => (
                                        <span key={tag.id} className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                                            {tag.name}
                                        </span>
                                    ))}
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full border border-dashed border-gray-300">
                                        <Plus className="h-3 w-3 text-gray-500" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.customer_phone}</span>
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> TP.HCM</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Gửi tin nhắn</Button>
                        <Button>Tạo đơn hàng</Button>
                    </div>
                </div>

                {/* AI Suggestion */}
                <AISuggestion context="customer" data={customer} />

                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column: Profile & Family */}
                    <div className="col-span-3 space-y-6">
                        <CustomerProfile customer={customer} />
                        {customer.family_members && <FamilyMembers members={customer.family_members} />}
                    </div>

                    {/* Right Column: Tabs */}
                    <div className="col-span-9">
                        <Tabs defaultValue="timeline" className="w-full">
                            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                                <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Hoạt động</TabsTrigger>
                                <TabsTrigger value="prescription" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Lịch sử thị lực</TabsTrigger>
                                <TabsTrigger value="orders" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Đơn hàng</TabsTrigger>
                            </TabsList>

                            <TabsContent value="timeline" className="mt-6">
                                <ActivityTimeline customerId={customer.customer_id} />
                            </TabsContent>

                            <TabsContent value="prescription" className="mt-6 space-y-6">
                                {customer.prescriptions && (
                                    <>
                                        <PrescriptionChart prescriptions={customer.prescriptions} />
                                        <PrescriptionHistory prescriptions={customer.prescriptions} />
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="orders" className="mt-6">
                                <div className="text-center py-10 text-gray-500">Chưa có dữ liệu đơn hàng (Mock)</div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
        </div >
    );
}
