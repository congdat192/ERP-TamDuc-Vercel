import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Award, ShieldAlert } from 'lucide-react';
import { BenefitsTabContent } from '@/modules/hr/components/benefits/BenefitsTabContent';
import { RewardsTabContent } from '@/modules/hr/components/rewards/RewardsTabContent';
import { DisciplineTabContent } from '@/modules/hr/components/discipline/DisciplineTabContent';

interface Props {
  employeeId: string;
}

export function EmployeeBenefitsTab({ employeeId }: Props) {
  const [subTab, setSubTab] = useState('benefits');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phúc Lợi, Khen Thưởng & Kỷ Luật</CardTitle>
        <CardDescription>
          Xem danh sách phúc lợi, khen thưởng và kỷ luật của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={subTab} onValueChange={setSubTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="benefits">
              <Gift className="w-4 h-4 mr-2" />
              Phúc Lợi
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Award className="w-4 h-4 mr-2" />
              Khen Thưởng
            </TabsTrigger>
            <TabsTrigger value="discipline">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Kỷ Luật
            </TabsTrigger>
          </TabsList>

          <TabsContent value="benefits">
            <BenefitsTabContent employeeId={employeeId} readOnly={true} />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsTabContent employeeId={employeeId} readOnly={true} />
          </TabsContent>

          <TabsContent value="discipline">
            <DisciplineTabContent employeeId={employeeId} readOnly={true} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
