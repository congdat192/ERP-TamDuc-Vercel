import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { crmService } from '../../services/crmService';
import { useToast } from '@/hooks/use-toast';
import { PipelineStage } from '../../types/crm';

interface PipelineSettingsProps {
    stages: PipelineStage[];
    onUpdate: () => void;
}

export function PipelineSettings({ stages, onUpdate }: PipelineSettingsProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [localStages, setLocalStages] = useState<PipelineStage[]>([]);

    useEffect(() => {
        setLocalStages(stages);
    }, [stages, open]);

    const handleStageChange = (index: number, field: keyof PipelineStage, value: string) => {
        const newStages = [...localStages];
        newStages[index] = { ...newStages[index], [field]: value };
        setLocalStages(newStages);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // In a real app, we would batch update or send the whole list
            // For now, we'll just simulate saving each changed stage
            for (const stage of localStages) {
                await crmService.updateStage(stage.id, stage);
            }

            toast({
                title: 'Thành công',
                description: 'Đã cập nhật cấu hình pipeline.',
            });
            setOpen(false);
            onUpdate();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể lưu cấu hình.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Cấu hình Pipeline</DialogTitle>
                    <DialogDescription>
                        Quản lý các giai đoạn bán hàng.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {localStages.map((stage, index) => (
                        <div key={stage.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-1 text-center text-sm text-gray-500">
                                #{index + 1}
                            </div>
                            <div className="col-span-6">
                                <Input
                                    value={stage.name}
                                    onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                                    placeholder="Tên giai đoạn"
                                />
                            </div>
                            <div className="col-span-4">
                                <Input
                                    value={stage.color}
                                    onChange={(e) => handleStageChange(index, 'color', e.target.value)}
                                    placeholder="Màu sắc (Tailwind class)"
                                />
                            </div>
                            <div className="col-span-1 text-center">
                                {/* Delete not implemented yet for safety */}
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
