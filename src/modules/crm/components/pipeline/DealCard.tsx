import { useState } from 'react';
import { CRMLead } from '../../types/crm';
import { EditLeadModal } from './EditLeadModal';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, DollarSign, MoreHorizontal, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface DealCardProps {
    lead: CRMLead;
    onMoveStage: (leadId: string, newStageId: number) => void;
}

export function DealCard({ lead, onMoveStage, onDelete }: DealCardProps & { onDelete?: (id: string) => void }) {
    const [showEditModal, setShowEditModal] = useState(false);

    return (
        <>
            <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <CardContent className="p-3 pb-2">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs font-normal text-gray-500">
                            {lead.source}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onMoveStage(lead.id, lead.stage_id + 1)}>
                                    Chuyển giai đoạn tiếp theo
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => onDelete?.(lead.id)}
                                >
                                    Xóa cơ hội
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                        {lead.title}
                    </h4>

                    <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={lead.customer_avatar} />
                            <AvatarFallback className="text-[10px]">{lead.customer_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600 truncate">{lead.customer_name}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span className="font-medium text-gray-900">
                                {new Intl.NumberFormat('vi-VN', { compactDisplay: 'short', notation: 'compact' }).format(lead.value)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(lead.updated_at), 'dd/MM')}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditLeadModal
                lead={lead}
                open={showEditModal}
                onOpenChange={setShowEditModal}
                onSuccess={() => window.location.reload()} // Simple reload for now
            />
        </>
    );
}
