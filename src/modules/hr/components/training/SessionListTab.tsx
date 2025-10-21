import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MapPin, Users as UsersIcon } from 'lucide-react';
import { TrainingSessionService, TrainingSession } from '../../services/trainingSessionService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CreateSessionModal } from './CreateSessionModal';

export function SessionListTab() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await TrainingSessionService.getSessions();
      setSessions(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'secondary',
      scheduled: 'default',
      ongoing: 'success',
      completed: 'secondary',
      cancelled: 'destructive'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <CreateSessionModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={loadSessions}
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lớp Học</CardTitle>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Lớp Học
              </Button>
            </div>
          </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có lớp học nào</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Tạo lớp học đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{session.session_name}</h3>
                          <Badge variant={getStatusColor(session.status) as any}>
                            {session.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(session.start_date), 'dd/MM/yyyy')} - 
                              {format(new Date(session.end_date), 'dd/MM/yyyy')}
                            </span>
                          </div>
                          
                          {session.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{session.location}</span>
                              <Badge variant="outline" className="text-xs">
                                {session.location_type}
                              </Badge>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4" />
                            <span>
                              {session.current_participants}
                              {session.max_participants && `/${session.max_participants}`} học viên
                            </span>
                          </div>
                        </div>

                        {session.training_trainers && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Giảng viên: </span>
                            <span className="font-medium">
                              {session.training_trainers.full_name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
