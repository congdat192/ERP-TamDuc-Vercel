
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Clock, User } from 'lucide-react';
import { Invitation } from '../../services/invitationService';
import { format } from 'date-fns';

interface InvitationsTableProps {
  invitations: Invitation[];
  isLoading?: boolean;
  onDelete?: (invitationId: string) => void;
}

export function InvitationsTable({ invitations, isLoading, onDelete }: InvitationsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Chờ phản hồi</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Đã chấp nhận</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Đã từ chối</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">Đã hết hạn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">Chưa có lời mời nào</p>
        <p className="text-gray-400 text-sm">Gửi lời mời để mời người dùng tham gia doanh nghiệp</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày gửi</TableHead>
          <TableHead>Người gửi</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell className="font-medium">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{invitation.email}</span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(invitation.status)}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {format(new Date(invitation.created_at), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {invitation.invited_by ? (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="font-medium">{invitation.invited_by.name}</p>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(invitation.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={invitation.status === 'accepted'}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
