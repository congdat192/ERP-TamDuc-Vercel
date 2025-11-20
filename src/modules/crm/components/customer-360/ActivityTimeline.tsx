import { useState, useEffect } from 'react';
import { CRMActivity } from '../../types/crm';
import { format } from 'date-fns';
import { Phone, MessageCircle, Calendar, FileText, ShoppingCart, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActivityTimelineProps {
    activities?: CRMActivity[];
    customerId?: number;
}

const getActivityIcon = (type: CRMActivity['type']) => {
    switch (type) {
        case 'call': return <Phone className="h-4 w-4 text-blue-500" />;
        case 'chat': return <MessageCircle className="h-4 w-4 text-green-500" />;
        case 'meeting': return <Calendar className="h-4 w-4 text-purple-500" />;
        case 'order': return <ShoppingCart className="h-4 w-4 text-orange-500" />;
        case 'booking': return <Calendar className="h-4 w-4 text-red-500" />;
        default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
};

const getActivityColor = (type: CRMActivity['type']) => {
    switch (type) {
        case 'call': return 'bg-blue-100 border-blue-200';
        case 'chat': return 'bg-green-100 border-green-200';
        case 'meeting': return 'bg-purple-100 border-purple-200';
        case 'order': return 'bg-orange-100 border-orange-200';
        case 'booking': return 'bg-red-100 border-red-200';
        default: return 'bg-gray-100 border-gray-200';
    }
};

export function ActivityTimeline({ activities, customerId }: ActivityTimelineProps) {
    const [localActivities, setLocalActivities] = useState<CRMActivity[]>(activities || []);

    useEffect(() => {
        if (activities) {
            setLocalActivities(activities);
        }
    }, [activities]);

    const displayActivities = activities || localActivities;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Lịch sử Tương tác (Activity Timeline)
                </CardTitle>
            </CardHeader>
            <CardContent className="relative pl-6 border-l-2 border-gray-200 ml-6 space-y-8">
                {displayActivities.map((activity) => (
                    <div key={activity.id} className="relative">
                        {/* Dot on timeline */}
                        <div className={`absolute -left-[33px] top-1 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{activity.title}</span>
                                <span className="text-xs text-gray-500">
                                    {format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm')}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">{activity.content}</p>

                            {/* Metadata Rendering */}
                            {activity.metadata && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {activity.metadata.link && (
                                        <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                            <a href={activity.metadata.link} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="mr-1 h-3 w-3" /> Mở hội thoại
                                            </a>
                                        </Button>
                                    )}
                                    {activity.metadata.amount && (
                                        <Badge variant="secondary">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activity.metadata.amount)}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <div className="mt-1 text-xs text-gray-400">
                                Thực hiện bởi: {activity.created_by_name}
                            </div>
                        </div>
                    </div>
                ))}

                {displayActivities.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        Chưa có hoạt động nào được ghi nhận.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
