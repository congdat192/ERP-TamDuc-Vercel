
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  type: 'tenant_created' | 'payment_received' | 'support_ticket' | 'system_alert' | 'user_login';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tenantName?: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tenant_created': return '🏢';
      case 'payment_received': return '💰';
      case 'support_ticket': return '🎫';
      case 'system_alert': return '⚠️';
      case 'user_login': return '👤';
      default: return '📋';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <CardTitle>Hoạt Động Gần Đây</CardTitle>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4 mr-1" />
            Xem Tất Cả
          </Button>
        </div>
        <CardDescription>
          Theo dõi các hoạt động quan trọng trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 6).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="text-lg">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <Badge className={getSeverityColor(activity.severity)}>
                    {activity.severity === 'critical' ? 'Khẩn cấp' :
                     activity.severity === 'high' ? 'Cao' :
                     activity.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: vi })}</span>
                  {activity.tenantName && (
                    <>
                      <span>•</span>
                      <span>{activity.tenantName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
