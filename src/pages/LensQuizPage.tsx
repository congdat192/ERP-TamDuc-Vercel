import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { lensQuizApi } from '@/modules/marketing/services/lensQuizApi';
import { lensUseCasesApi } from '@/modules/marketing/services/lensUseCasesApi';
import { LensQuizAnswers, LensQuizRecommendation } from '@/modules/marketing/types/lens-extended';
import { QuizRecommendationCard } from '@/modules/marketing/components/lens/QuizRecommendationCard';
import { toast } from 'sonner';

export function LensQuizPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<LensQuizAnswers>({
    use_cases: [],
    sph: 0,
    cyl: 0,
    budget_min: undefined,
    budget_max: undefined
  });
  const [recommendations, setRecommendations] = useState<LensQuizRecommendation[]>([]);

  const { data: useCases = [] } = useQuery({
    queryKey: ['use-cases'],
    queryFn: () => lensUseCasesApi.getAll()
  });

  const getRecommendationsMutation = useMutation({
    mutationFn: lensQuizApi.getRecommendations,
    onSuccess: (data) => {
      setRecommendations(data);
      setStep(4);
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tìm kiếm sản phẩm phù hợp');
    }
  });

  const handleUseCaseToggle = (code: string) => {
    setAnswers(prev => ({
      ...prev,
      use_cases: prev.use_cases.includes(code)
        ? prev.use_cases.filter(c => c !== code)
        : [...prev.use_cases, code]
    }));
  };

  const handleNext = () => {
    if (step === 1 && answers.use_cases.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 nhu cầu sử dụng');
      return;
    }
    if (step === 3) {
      getRecommendationsMutation.mutate(answers);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleRestart = () => {
    setStep(1);
    setAnswers({
      use_cases: [],
      sph: 0,
      cyl: 0,
      budget_min: undefined,
      budget_max: undefined
    });
    setRecommendations([]);
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Tìm Tròng Kính Phù Hợp</h1>
          <p className="text-muted-foreground text-lg">
            Trả lời vài câu hỏi để nhận gợi ý sản phẩm tốt nhất cho bạn
          </p>
        </div>

        {/* Progress */}
        {step <= 3 && (
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Bước {step}/3</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Step 1: Use Cases */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Bạn sử dụng kính cho mục đích gì?</CardTitle>
              <p className="text-sm text-muted-foreground">Chọn tất cả các nhu cầu phù hợp</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {useCases.map((useCase) => (
                <div
                  key={useCase.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers.use_cases.includes(useCase.code)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleUseCaseToggle(useCase.code)}
                >
                  <Checkbox
                    checked={answers.use_cases.includes(useCase.code)}
                    onCheckedChange={() => handleUseCaseToggle(useCase.code)}
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-primary">
                      {getIcon(useCase.icon)}
                    </div>
                    <div>
                      <p className="font-semibold">{useCase.name}</p>
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Prescription */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Nhập độ kính của bạn</CardTitle>
              <p className="text-sm text-muted-foreground">
                Thông tin này giúp chúng tôi tìm sản phẩm có sẵn phù hợp
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sph">Độ cầu (SPH)</Label>
                  <Input
                    id="sph"
                    type="number"
                    step="0.25"
                    value={answers.sph}
                    onChange={(e) => setAnswers(prev => ({ ...prev, sph: parseFloat(e.target.value) || 0 }))}
                    placeholder="VD: -3.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Số âm (-) là cận, số dương (+) là viễn
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cyl">Độ loạn (CYL)</Label>
                  <Input
                    id="cyl"
                    type="number"
                    step="0.25"
                    value={answers.cyl}
                    onChange={(e) => setAnswers(prev => ({ ...prev, cyl: parseFloat(e.target.value) || 0 }))}
                    placeholder="VD: -1.0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Thường là số âm hoặc 0
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Mẹo:</strong> Bạn có thể tìm thông tin độ kính trên đơn thuốc của bác sĩ
                  hoặc trên hộp tròng kính hiện tại.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Ngân sách của bạn (Tùy chọn)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bỏ qua nếu bạn không muốn lọc theo giá
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget_min">Giá từ (₫)</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    step="100000"
                    value={answers.budget_min || ''}
                    onChange={(e) => setAnswers(prev => ({ 
                      ...prev, 
                      budget_min: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="VD: 500000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget_max">Giá đến (₫)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    step="100000"
                    value={answers.budget_max || ''}
                    onChange={(e) => setAnswers(prev => ({ 
                      ...prev, 
                      budget_max: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="VD: 2000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Gợi ý nhanh:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
                    { label: '1-2 triệu', min: 1000000, max: 2000000 },
                    { label: '2-3 triệu', min: 2000000, max: 3000000 },
                    { label: 'Trên 3 triệu', min: 3000000, max: undefined }
                  ].map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => setAnswers(prev => ({ 
                        ...prev, 
                        budget_min: preset.min,
                        budget_max: preset.max
                      }))}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Tìm thấy {recommendations.length} sản phẩm phù hợp
              </h2>
              <p className="text-muted-foreground">
                Được xếp hạng theo mức độ phù hợp với nhu cầu của bạn
              </p>
            </div>

            {recommendations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    Không tìm thấy sản phẩm phù hợp với yêu cầu của bạn.
                    Vui lòng thử lại với độ kính hoặc ngân sách khác.
                  </p>
                  <Button onClick={handleRestart}>
                    Làm lại quiz
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <QuizRecommendationCard
                    key={recommendation.product.id}
                    recommendation={recommendation}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center">
              <Button onClick={handleRestart} variant="outline">
                Làm lại quiz
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step <= 3 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Button
              onClick={handleNext}
              disabled={getRecommendationsMutation.isPending}
            >
              {getRecommendationsMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tìm kiếm...
                </>
              ) : step === 3 ? (
                <>
                  Xem kết quả
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Tiếp theo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
