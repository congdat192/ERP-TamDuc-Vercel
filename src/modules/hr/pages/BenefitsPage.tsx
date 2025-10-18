import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Award, AlertTriangle } from 'lucide-react';
import { BenefitsTabContent } from '../components/benefits/BenefitsTabContent';
import { RewardsTabContent } from '../components/rewards/RewardsTabContent';
import { DisciplineTabContent } from '../components/discipline/DisciplineTabContent';

export function BenefitsPage() {
  const [activeTab, setActiveTab] = useState<'benefits' | 'rewards' | 'discipline'>('benefits');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Phúc Lợi & Kỷ Luật</h2>
          <p className="text-muted-foreground mt-2">
            Quản lý phúc lợi, khen thưởng và kỷ luật nhân viên
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="benefits" className="gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Phúc Lợi</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Khen Thưởng</span>
          </TabsTrigger>
          <TabsTrigger value="discipline" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Kỷ Luật</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="benefits" className="mt-6">
          <BenefitsTabContent />
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <RewardsTabContent />
        </TabsContent>

        <TabsContent value="discipline" className="mt-6">
          <DisciplineTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
