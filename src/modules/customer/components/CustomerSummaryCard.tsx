import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Users, ChevronRight } from "lucide-react";

interface CustomerSummaryCardProps {
  customer: any;
  onClick: (customer: any) => void;
}

export function CustomerSummaryCard({ customer, onClick }: CustomerSummaryCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] p-4"
      onClick={() => onClick(customer)}
    >
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-16 h-16 flex-shrink-0">
          <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
            {getInitials(customer.customerName || "KH")}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground truncate mb-1">
            {customer.customerName}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {customer.customerCode}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{customer.phone}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{customer.customerGroup || "Chưa phân nhóm"}</span>
          </div>
        </div>
        
        <Badge 
          variant={customer.status === "Đang hoạt động" ? "default" : "secondary"}
          className="flex-shrink-0"
        >
          {customer.status || "Active"}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-3 bg-destructive/10 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Công nợ</div>
          <div className="text-sm font-bold text-destructive">
            {formatCurrency(customer.currentDebt || 0)}
          </div>
        </div>
        
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Tổng mua</div>
          <div className="text-sm font-bold text-primary">
            {formatCurrency(customer.totalSales || 0)}
          </div>
        </div>
        
        <div className="text-center p-3 bg-green-500/10 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Điểm</div>
          <div className="text-sm font-bold text-green-600 dark:text-green-500">
            {customer.currentPoints || 0}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary pt-2 border-t">
        <span>Xem chi tiết</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </Card>
  );
}
