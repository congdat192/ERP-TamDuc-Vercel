import { CRMLead, PipelineStage } from '../../types/crm';
import { DealCard } from './DealCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StageColumnProps {
    stage: PipelineStage;
    leads: CRMLead[];
    onMoveStage: (leadId: string, newStageId: number) => void;
    onDeleteLead?: (leadId: string) => void;
}

export function StageColumn({ stage, leads, onMoveStage, onDeleteLead }: StageColumnProps) {
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

    return (
        <div className="flex flex-col h-full min-w-[280px] w-[280px] bg-gray-100/50 rounded-lg border border-gray-200">
            {/* Header */}
            <div className={`p-3 rounded-t-lg border-b border-gray-200 ${stage.color} bg-opacity-20`}>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">
                        {stage.name}
                    </h3>
                    <span className="text-xs font-medium bg-white/50 px-2 py-0.5 rounded-full">
                        {leads.length}
                    </span>
                </div>
                <div className="text-xs opacity-80 font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalValue)}
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                    {leads.map((lead) => (
                        <DealCard
                            key={lead.id}
                            lead={lead}
                            onMoveStage={onMoveStage}
                            onDelete={onDeleteLead}
                        />
                    ))}
                    {leads.length === 0 && (
                        <div className="h-20 flex items-center justify-center text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                            Trống
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
