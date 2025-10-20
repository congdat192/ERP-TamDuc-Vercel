import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompetencyService } from '../../services/competencyService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function CompetencyMatrixTab() {
  const { toast } = useToast();
  const [matrix, setMatrix] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matrixData, levelsData] = await Promise.all([
        CompetencyService.getCompetencyMatrix(),
        CompetencyService.getCompetencyLevels()
      ]);
      setMatrix(matrixData);
      setLevels(levelsData);
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

  const getLevelBadge = (level: number) => {
    const levelData = levels.find(l => l.level === level);
    if (!levelData) return <Badge variant="secondary">Level {level}</Badge>;

    return (
      <Badge 
        style={{ backgroundColor: levelData.color, color: 'white' }}
        className="font-semibold"
      >
        {levelData.name} ({level})
      </Badge>
    );
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
    <div className="space-y-4">
      {/* Competency Levels Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Khung Năng Lực 5 Bậc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {levels.map(level => (
              <Card key={level.level} className="border-2">
                <CardContent className="p-4 text-center">
                  <div 
                    className="w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold mx-auto mb-3"
                    style={{ backgroundColor: level.color }}
                  >
                    {level.level}
                  </div>
                  <h3 className="font-semibold mb-1">{level.name}</h3>
                  {level.description && (
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competency Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Ma Trận Năng Lực Nhân Viên</CardTitle>
        </CardHeader>
        <CardContent>
          {matrix.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có dữ liệu năng lực</p>
              <p className="text-sm text-muted-foreground mt-2">
                Năng lực sẽ được cập nhật tự động khi nhân viên hoàn thành khóa đào tạo
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Nhân Viên</TableHead>
                    <TableHead>Mã NV</TableHead>
                    <TableHead>Phòng Ban</TableHead>
                    <TableHead>Chức Vụ</TableHead>
                    <TableHead className="min-w-[300px]">Năng Lực</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrix.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.employee?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>{item.employee?.employee_code || 'N/A'}</TableCell>
                      <TableCell>{item.employee?.department || 'N/A'}</TableCell>
                      <TableCell>{item.employee?.position || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {item.competencies && item.competencies.length > 0 ? (
                            item.competencies.map((comp: any) => (
                              <div key={comp.id} className="flex items-center gap-2">
                                <span className="text-sm">{comp.competency_name}:</span>
                                {getLevelBadge(comp.current_level)}
                              </div>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">Chưa đánh giá</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
