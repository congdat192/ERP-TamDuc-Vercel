import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Target, Save } from 'lucide-react';
import { lensUseCasesApi } from '../../services/lensUseCasesApi';
import { LensUseCase, LensProductUseCaseScore } from '../../types/lens-extended';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';

interface UseCaseScoringManagerProps {
  productId: string;
}

export function UseCaseScoringManager({ productId }: UseCaseScoringManagerProps) {
  const queryClient = useQueryClient();
  const [scores, setScores] = useState<Record<string, { score: number; reasoning: string }>>({});

  const { data: useCases } = useQuery({
    queryKey: ['use-cases'],
    queryFn: () => lensUseCasesApi.getAll()
  });

  const { data: existingScores } = useQuery({
    queryKey: ['product-scores', productId],
    queryFn: () => lensUseCasesApi.getScoresByProductId(productId)
  });

  useEffect(() => {
    if (existingScores) {
      const scoreMap: Record<string, { score: number; reasoning: string }> = {};
      existingScores.forEach(s => {
        if (s.use_case) {
          scoreMap[s.use_case_id] = {
            score: s.score,
            reasoning: s.reasoning || ''
          };
        }
      });
      setScores(scoreMap);
    }
  }, [existingScores]);

  const mutation = useMutation({
    mutationFn: async ({ useCaseId, score, reasoning }: { useCaseId: string; score: number; reasoning: string }) => {
      return lensUseCasesApi.upsertScore(productId, useCaseId, score, reasoning);
    },
    onSuccess: () => {
      toast.success('Đã lưu điểm số');
      queryClient.invalidateQueries({ queryKey: ['product-scores', productId] });
    },
    onError: () => {
      toast.error('Lỗi khi lưu điểm số');
    }
  });

  const handleScoreChange = (useCaseId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [useCaseId]: {
        score,
        reasoning: prev[useCaseId]?.reasoning || ''
      }
    }));
  };

  const handleReasoningChange = (useCaseId: string, reasoning: string) => {
    setScores(prev => ({
      ...prev,
      [useCaseId]: {
        score: prev[useCaseId]?.score || 50,
        reasoning
      }
    }));
  };

  const handleSave = (useCaseId: string) => {
    const data = scores[useCaseId];
    if (data) {
      mutation.mutate({ useCaseId, score: data.score, reasoning: data.reasoning });
    }
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return <Target className="w-5 h-5" />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Target className="w-5 h-5" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Chấm điểm Use Cases</h3>
      </div>

      <div className="space-y-6">
        {useCases?.map((useCase) => {
          const currentScore = scores[useCase.id]?.score || 0;
          const currentReasoning = scores[useCase.id]?.reasoning || '';

          return (
            <div key={useCase.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-primary">
                    {getIcon(useCase.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{useCase.name}</h4>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {currentScore}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground min-w-[40px]">0</span>
                  <Slider
                    value={[currentScore]}
                    onValueChange={([value]) => handleScoreChange(useCase.id, value)}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground min-w-[40px]">100</span>
                </div>

                <Textarea
                  placeholder="Lý do đánh giá (VD: Chống ánh sáng xanh tốt, phù hợp với người dùng máy tính nhiều)"
                  value={currentReasoning}
                  onChange={(e) => handleReasoningChange(useCase.id, e.target.value)}
                  className="min-h-[60px]"
                />

                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={() => handleSave(useCase.id)}
                    disabled={mutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {(!useCases || useCases.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            Không có use case nào
          </div>
        )}
      </div>
    </div>
  );
}
