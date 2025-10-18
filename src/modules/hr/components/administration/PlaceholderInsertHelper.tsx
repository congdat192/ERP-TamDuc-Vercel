import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DocType } from '../../types/administration';
import { DocumentTemplateService } from '../../services/documentTemplateService';

interface PlaceholderInsertHelperProps {
  docType: DocType;
  onInsert: (placeholder: string) => void;
}

export function PlaceholderInsertHelper({ docType, onInsert }: PlaceholderInsertHelperProps) {
  const placeholders = DocumentTemplateService.getAvailablePlaceholders(docType);

  const groupedPlaceholders = {
    common: {
      label: 'Chung',
      items: Object.entries(placeholders).filter(([key]) =>
        key.includes('current_date') || key.includes('doc_no')
      ),
    },
    employee: {
      label: 'Thông Tin Nhân Viên',
      items: Object.entries(placeholders).filter(([key]) =>
        key.includes('employee') || key.includes('position') || 
        key.includes('department') || key.includes('team') || 
        key.includes('join_date') || key.includes('email') || 
        key.includes('phone') || key.includes('address') || 
        key.includes('emergency')
      ),
    },
    salary: {
      label: 'Lương & Phụ Cấp',
      items: Object.entries(placeholders).filter(([key]) =>
        key.includes('salary') || key.includes('allowance') || 
        key.includes('employment_type')
      ),
    },
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Trường Dữ Liệu</CardTitle>
        <p className="text-xs text-muted-foreground">
          Click để chèn vào nội dung
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {Object.entries(groupedPlaceholders).map(([key, group]) => (
              <div key={key}>
                <h4 className="font-medium text-sm mb-2 theme-text-primary">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.items.map(([placeholder, description]) => (
                    <Button
                      key={placeholder}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() => onInsert(placeholder)}
                    >
                      <div className="flex flex-col items-start">
                        <code className="font-mono text-xs theme-text-primary">
                          {placeholder}
                        </code>
                        <span className="text-muted-foreground text-xs">
                          {description}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
