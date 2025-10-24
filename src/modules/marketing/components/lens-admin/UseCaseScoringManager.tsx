import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Target, Save, SaveAll } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  const [hasChanges, setHasChanges] = useState(false);
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());

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
      setHasChanges(false);
      setChangedIds(new Set());
    },
    onError: () => {
      toast.error('Lỗi khi lưu điểm số');
    }
  });

  const batchMutation = useMutation({
    mutationFn: async (updates: Array<{ useCaseId: string; score: number; reasoning: string }>) => {
      return Promise.all(
        updates.map(({ useCaseId, score, reasoning }) => 
          lensUseCasesApi.upsertScore(productId, useCaseId, score, reasoning)
        )
      );
    },
    onSuccess: () => {
      toast.success('Đã lưu tất cả thay đổi');
      queryClient.invalidateQueries({ queryKey: ['product-scores', productId] });
      setHasChanges(false);
      setChangedIds(new Set());
    },
    onError: () => {
      toast.error('Lỗi khi lưu thay đổi');
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
    setHasChanges(true);
    setChangedIds(prev => new Set(prev).add(useCaseId));
  };

  const handleReasoningChange = (useCaseId: string, reasoning: string) => {
    setScores(prev => ({
      ...prev,
      [useCaseId]: {
        score: prev[useCaseId]?.score || 50,
        reasoning
      }
    }));
    setHasChanges(true);
    setChangedIds(prev => new Set(prev).add(useCaseId));
  };

  const handleSave = (useCaseId: string) => {
    const data = scores[useCaseId];
    if (data) {
      mutation.mutate({ useCaseId, score: data.score, reasoning: data.reasoning });
    }
  };

  const handleBatchSave = () => {
    const updates = Array.from(changedIds)
      .map(useCaseId => {
        const data = scores[useCaseId];
        return data ? { useCaseId, score: data.score, reasoning: data.reasoning } : null;
      })
      .filter(Boolean) as Array<{ useCaseId: string; score: number; reasoning: string }>;
    
    if (updates.length > 0) {
      batchMutation.mutate(updates);
    }
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return <Target className="w-5 h-5" />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Target className="w-5 h-5" />;
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-red-600 bg-red-50 border-red-200';
    if (score < 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Chấm điểm Use Cases</h3>
        </div>
        {hasChanges && (
          <Button 
            onClick={handleBatchSave}
            disabled={batchMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <SaveAll className="w-4 h-4 mr-2" />
            Lưu tất cả thay đổi ({changedIds.size})
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="space-y-2">
        {useCases?.map((useCase) => {
          const currentScore = scores[useCase.id]?.score || 0;
          const currentReasoning = scores[useCase.id]?.reasoning || '';
          const isChanged = changedIds.has(useCase.id);

          return (
            <AccordionItem 
              key={useCase.id} 
              value={useCase.id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-primary">
                    {getIcon(useCase.icon)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{useCase.name}</h4>
                      {isChanged && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Chưa lưu
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
                  <div className={`text-lg font-bold px-3 py-1 rounded-full border ${getScoreColor(currentScore)}`}>
                    {currentScore}
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent>
                <div className="space-y-3 pt-3">
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
                    className="min-h-[100px]"
                  />

                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSave(useCase.id)}
                      disabled={mutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu riêng
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {(!useCases || useCases.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          Không có use case nào
        </div>
      )}
    </div>
  );
}
