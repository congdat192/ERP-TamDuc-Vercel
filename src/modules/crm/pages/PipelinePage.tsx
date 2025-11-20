import { useState, useEffect } from 'react';
import { crmService } from '../services/crmService';
import { CRMNavigation } from '../components/shared/CRMNavigation';
import { CRMLead, PipelineStage } from '../types/crm';
import { StageColumn } from '../components/pipeline/StageColumn';
import { CreateLeadModal } from '../components/pipeline/CreateLeadModal';
import { PipelineSettings } from '../components/pipeline/PipelineSettings';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PipelinePage() {
    const [leads, setLeads] = useState<CRMLead[]>([]);
    const [stages, setStages] = useState<PipelineStage[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const loadData = async () => {
        setLoading(true);
        try {
            const [leadsData, stagesData] = await Promise.all([
                crmService.getLeads(),
                crmService.getStages()
            ]);
            setLeads(leadsData);
            setStages(stagesData);
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể tải dữ liệu pipeline.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleMoveStage = async (leadId: string, newStageId: number) => {
        // Optimistic update
        setLeads((prev) =>
            prev.map((l) => (l.id === leadId ? { ...l, stage_id: newStageId as any } : l))
        );

        try {
            await crmService.updateLeadStage(leadId, newStageId);
            toast({ title: 'Thành công', description: 'Đã cập nhật giai đoạn.' });
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Cập nhật thất bại.', variant: 'destructive' });
            loadData(); // Revert on error
        }
    };

    const handleDeleteLead = async (leadId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa cơ hội này?')) return;

        try {
            await crmService.deleteLead(leadId);
            toast({ title: 'Thành công', description: 'Đã xóa cơ hội.' });
            setLeads(prev => prev.filter(l => l.id !== leadId));
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Xóa thất bại.', variant: 'destructive' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <CRMNavigation />
            <div className="flex-1 flex flex-col p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quy trình Bán hàng (Sales Pipeline)</h1>
                        <p className="text-sm text-gray-500">Quản lý các cơ hội kinh doanh theo giai đoạn.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={loadData} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <PipelineSettings stages={stages} onUpdate={loadData} />
                        <CreateLeadModal onSuccess={loadData} />
                    </div>
                </div>

                {/* Kanban Board Container */}
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-4 h-full min-w-max">
                        {stages.map((stage) => (
                            <StageColumn
                                key={stage.id}
                                stage={stage}
                                leads={leads.filter((l) => l.stage_id === stage.id)}
                                onMoveStage={handleMoveStage}
                                onDeleteLead={handleDeleteLead}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
