import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DocumentTable } from '@/modules/hr/components/administration/DocumentTable';
import type { AdministrativeDocument } from '@/modules/hr/types/administration';

interface Props {
  employeeId: string;
}

export function EmployeeDocumentsTab({ employeeId }: Props) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<AdministrativeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [employeeId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('administrative_documents')
        .select(`
          *,
          employee:employees(
            full_name,
            employee_code,
            position,
            department
          )
        `)
        .or(`employee_id.eq.${employeeId},and(employee_id.is.null,status.eq.published)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data as any || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách hồ sơ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hồ Sơ Hành Chính</CardTitle>
        <CardDescription>
          Các văn bản liên quan đến bạn và thông báo công ty
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DocumentTable
            documents={documents}
            onView={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            readOnly={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
