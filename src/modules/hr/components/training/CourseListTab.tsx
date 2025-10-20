import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TrainingProgramService, TrainingProgram } from '../../services/trainingProgramService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CreateProgramModal } from './CreateProgramModal';

export function CourseListTab() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await TrainingProgramService.getPrograms();
      setPrograms(data);
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

  const filteredPrograms = programs.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'destructive'> = {
      draft: 'secondary',
      scheduled: 'default',
      ongoing: 'success',
      completed: 'secondary',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
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
      <CreateProgramModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={loadPrograms}
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chương Trình Đào Tạo</CardTitle>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Chương Trình
              </Button>
            </div>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm chương trình..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có chương trình đào tạo nào</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Tạo chương trình đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrograms.map(program => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                      {getStatusBadge(program.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {program.description || 'Chưa có mô tả'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Loại: {program.program_type}</span>
                      <span>{program.duration_hours}h</span>
                    </div>
                    {program.competency_name && (
                      <Badge variant="outline" className="text-xs">
                        {program.competency_name} Level {program.target_competency_level}
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Tạo: {format(new Date(program.created_at), 'dd/MM/yyyy')}
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
