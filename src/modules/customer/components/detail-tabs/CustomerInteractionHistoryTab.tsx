
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Headphones, Play, Calendar, User, Clock } from 'lucide-react';

interface Interaction {
  id: string;
  type: 'call' | 'message' | 'support';
  date: string;
  time: string;
  title: string;
  description: string;
  channel?: 'zalo' | 'facebook' | 'sms' | 'phone' | 'email';
  performer: string;
  status?: 'completed' | 'missed' | 'pending' | 'resolved';
  hasRecording?: boolean;
  recordingUrl?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

interface CustomerInteractionHistoryTabProps {
  customerId: string;
  interactionHistory?: Array<{
    cost: number;
    date: string;
    type: string;
    title: string;
    status: string;
    channel: string;
    message: string;
    batch_id: string;
    metadata: {
      error: string | null;
      sms_id: string;
      provider: string;
      sender_name: string;
    };
    delivery_status: string;
  }>;
}

export function CustomerInteractionHistoryTab({ 
  customerId, 
  interactionHistory = [] 
}: CustomerInteractionHistoryTabProps) {
  const [loading, setLoading] = useState(false);

  // Transform API data to UI format
  const transformedInteractions: Interaction[] = useMemo(() => {
    return interactionHistory.map((item, index) => {
      const dateObj = new Date(item.date);
      const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = dateObj.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }); // HH:mm

      return {
        id: item.batch_id || `interaction-${index}`,
        type: 'message' as const, // All SMS are messages
        date: dateStr,
        time: timeStr,
        title: item.title,
        description: item.message,
        channel: item.channel as 'sms',
        performer: item.metadata?.sender_name || 'Hệ thống',
        status: (item.delivery_status === 'delivered' ? 'completed' : 
                item.delivery_status === 'failed' ? 'missed' : 
                'pending') as 'completed' | 'missed' | 'pending',
        hasRecording: false,
        category: item.type === 'sms_birthday' ? 'SMS sinh nhật' : 'SMS',
      };
    });
  }, [interactionHistory]);

  // Group by date
  const groupedInteractions = useMemo(() => {
    return transformedInteractions.reduce((groups, interaction) => {
      const date = interaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(interaction);
      return groups;
    }, {} as Record<string, Interaction[]>);
  }, [transformedInteractions]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'message': return MessageCircle;
      case 'support': return Headphones;
      default: return MessageCircle;
    }
  };

  const getChannelBadge = (channel?: string) => {
    if (!channel) return null;
    const channelConfig = {
      zalo: { className: "bg-blue-100 text-blue-800", label: "Zalo" },
      facebook: { className: "bg-blue-100 text-blue-800", label: "Facebook" },
      sms: { className: "bg-green-100 text-green-800", label: "SMS" },
      phone: { className: "bg-orange-100 text-orange-800", label: "Điện thoại" },
      email: { className: "bg-purple-100 text-purple-800", label: "Email" }
    };
    const config = channelConfig[channel as keyof typeof channelConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const statusConfig = {
      completed: { className: "bg-green-100 text-green-800", label: "Hoàn thành" },
      missed: { className: "bg-red-100 text-red-800", label: "Nhỡ" },
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Đang xử lý" },
      resolved: { className: "bg-blue-100 text-blue-800", label: "Đã giải quyết" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    const priorityConfig = {
      low: { className: "bg-gray-100 text-gray-800", label: "Thấp" },
      medium: { className: "bg-orange-100 text-orange-800", label: "Trung bình" },
      high: { className: "bg-red-100 text-red-800", label: "Cao" }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const playRecording = (recordingUrl: string) => {
    // Mock play recording functionality
    console.log('Playing recording:', recordingUrl);
    alert('Đang phát file ghi âm...');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (transformedInteractions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Chưa có lịch sử tương tác
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          Các tương tác với khách hàng (SMS, cuộc gọi, tin nhắn) sẽ được hiển thị tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold theme-text">Lịch Sử Tương Tác</h3>
      
      <div className="space-y-6">
        {Object.entries(groupedInteractions)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, interactions]) => (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(date).toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200"></div>
                
                <div className="space-y-6">
                  {interactions
                    .sort((a, b) => b.time.localeCompare(a.time))
                    .map((interaction, index) => {
                      const IconComponent = getTypeIcon(interaction.type);
                      return (
                        <div key={interaction.id} className="relative flex space-x-4">
                          {/* Timeline Icon */}
                          <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center theme-bg-primary/10">
                            <IconComponent className="w-5 h-5 theme-text-primary" />
                          </div>
                          
                          {/* Content */}
                          <Card className="flex-1">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{interaction.title}</h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {interaction.time}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <User className="w-3 h-3 mr-1" />
                                      {interaction.performer}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {interaction.hasRecording && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => playRecording(interaction.recordingUrl!)}
                                      className="h-8 px-2"
                                    >
                                      <Play className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-3">{interaction.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {getChannelBadge(interaction.channel)}
                                {getStatusBadge(interaction.status)}
                                {getPriorityBadge(interaction.priority)}
                                {interaction.category && (
                                  <Badge variant="outline">{interaction.category}</Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
