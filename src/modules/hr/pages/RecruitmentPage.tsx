import { UserPlus, Briefcase, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Candidate } from '../types';

const dummyCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Phạm Văn D',
    position: 'Sales Manager',
    email: 'd.pham@example.com',
    phone: '0904567890',
    appliedDate: '2024-01-10',
    status: 'interview1',
    avatar: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Hoàng Thị E',
    position: 'Marketing Specialist',
    email: 'e.hoang@example.com',
    phone: '0905678901',
    appliedDate: '2024-01-12',
    status: 'screening',
    avatar: '/placeholder.svg',
  },
];

export function RecruitmentPage() {
  const pipelineStages = [
    { id: 'applied', label: 'Đã Nộp CV', count: 5, color: 'bg-blue-500' },
    { id: 'screening', label: 'Sàng Lọc', count: 3, color: 'bg-purple-500' },
    { id: 'interview1', label: 'PV Vòng 1', count: 2, color: 'bg-yellow-500' },
    { id: 'interview2', label: 'PV Vòng 2', count: 1, color: 'bg-orange-500' },
    { id: 'offer', label: 'Offer', count: 1, color: 'bg-green-500' },
    { id: 'onboarding', label: 'Onboarding', count: 0, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Tuyển Dụng</h1>
          <p className="theme-text-secondary mt-1">Quản lý quy trình tuyển dụng và ứng viên</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Đăng Tin Tuyển Dụng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 theme-text-primary" />
              <div>
                <p className="text-sm theme-text-secondary">Vị Trí Đang Tuyển</p>
                <p className="text-2xl font-bold theme-text">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm theme-text-secondary">Ứng Viên Mới</p>
                <p className="text-2xl font-bold theme-text">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm theme-text-secondary">Đã Tuyển Tháng Này</p>
                <p className="text-2xl font-bold theme-text">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm theme-text-secondary">Tỷ Lệ Chuyển Đổi</p>
                <p className="text-2xl font-bold theme-text">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Kanban */}
      <Card className="theme-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="theme-text">Pipeline Tuyển Dụng</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Bộ Lọc
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {pipelineStages.map((stage) => (
              <div key={stage.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm theme-text">{stage.label}</h3>
                  <Badge variant="secondary">{stage.count}</Badge>
                </div>
                <div className={`h-1 rounded-full ${stage.color}`} />
                <div className="space-y-2">
                  {dummyCandidates
                    .filter((c) => c.status === stage.id)
                    .map((candidate) => (
                      <Card key={candidate.id} className="theme-card cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm theme-text truncate">
                                {candidate.name}
                              </p>
                              <p className="text-xs theme-text-secondary truncate">
                                {candidate.position}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs theme-text-secondary">{candidate.appliedDate}</p>
                        </CardContent>
                      </Card>
                    ))}
                  {stage.count === 0 && (
                    <div className="border-2 border-dashed theme-border-primary rounded-lg p-4 text-center">
                      <p className="text-xs theme-text-secondary">Chưa có ứng viên</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Postings */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Tin Tuyển Dụng Đang Mở</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 theme-text-secondary">
            <div className="text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có tin tuyển dụng nào</p>
              <Button className="mt-4" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Đăng Tin Mới
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
