import { useState } from 'react';
import { FileText, Eye, Edit, Trash2, MoreHorizontal, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AdministrativeDocument } from '../../types/administration';
import {
  getDocTypeLabel,
  getStatusLabel,
  getStatusColor,
} from '../../types/administration';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DocumentTableProps {
  documents: AdministrativeDocument[];
  onView: (doc: AdministrativeDocument) => void;
  onEdit: (doc: AdministrativeDocument) => void;
  onDelete: (doc: AdministrativeDocument) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  readOnly?: boolean;
}

export function DocumentTable({
  documents,
  onView,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
  readOnly = false,
}: DocumentTableProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Chưa có văn bản nào</h3>
        <p className="text-sm text-muted-foreground">
          Nhấn "Tạo Văn Bản" để thêm văn bản mới
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Số văn bản</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Ngày phát hành</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.doc_no}</TableCell>
              <TableCell>
                <Badge variant="outline">{getDocTypeLabel(doc.doc_type)}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">{doc.subject}</TableCell>
              <TableCell>
                {format(new Date(doc.issue_date), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
            <TableCell>
              {doc.employee ? (
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-medium">{doc.employee.full_name}</p>
                    <p className="text-xs text-muted-foreground">{doc.employee.employee_code}</p>
                  </div>
                </div>
              ) : doc.is_orphaned ? (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Nhân viên đã xóa
                </Badge>
              ) : (
                <Badge variant="secondary">Văn bản công ty</Badge>
              )}
            </TableCell>
              <TableCell>
                <Badge className={getStatusColor(doc.status)}>
                  {getStatusLabel(doc.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {!readOnly && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(doc)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      {canEdit && doc.status === 'draft' && (
                        <DropdownMenuItem onClick={() => onEdit(doc)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(doc)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
