import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HelpLayoutProps {
  title: string;
  children: ReactNode;
}

export function HelpLayout({ title, children }: HelpLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/ERP')}
          >
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <Card>
          <CardContent className="p-8">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {children}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
