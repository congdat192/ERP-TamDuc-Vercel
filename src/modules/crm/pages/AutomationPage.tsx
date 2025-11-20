import { WorkflowBuilder } from '../components/automation/WorkflowBuilder';
import { Button } from '@/components/ui/button';
import { CRMNavigation } from '../components/shared/CRMNavigation';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function AutomationPage() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: 'Thành công',
            description: 'Đã lưu quy trình tự động hóa.',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <CRMNavigation />
            <div className="p-6 space-y-6">
                <div className="h-16 border-b bg-white px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/crm')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Automation Workflow</h1>
                            <p className="text-xs text-gray-500">Thiết kế quy trình tự động hóa CSKH</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" /> Lưu quy trình
                        </Button>
                    </div>
                </div>

                <WorkflowBuilder />
            </div>
        </div>
    );
}
