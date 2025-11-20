import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Supplier } from '../../types';
import { Edit, Eye, DollarSign } from 'lucide-react';

interface SupplierTableProps {
    suppliers: Supplier[];
    debtMap: Record<string, number>;
    onPay: (supplier: Supplier) => void;
    onEdit: (supplier: Supplier) => void;
    onView: (supplier: Supplier) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
    suppliers,
    debtMap,
    onPay,
    onEdit,
    onView
}) => {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã NCC</TableHead>
                        <TableHead>Tên Nhà Cung Cấp</TableHead>
                        <TableHead>Liên Hệ</TableHead>
                        <TableHead className="text-right">Nợ Phải Trả</TableHead>
                        <TableHead className="text-right">Hành Động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {suppliers.map((supplier) => {
                        const currentDebt = debtMap[supplier.id] || 0;
                        return (
                            <TableRow key={supplier.id}>
                                <TableCell className="font-medium">{supplier.code}</TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{supplier.name}</div>
                                        <div className="text-xs text-gray-500">{supplier.address}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">{supplier.contactPerson}</div>
                                    <div className="text-xs text-gray-500">{supplier.phone}</div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-rose-600">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentDebt)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onEdit(supplier)}
                                            title="Chỉnh sửa thông tin"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onView(supplier)}
                                            title="Xem chi tiết"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-rose-600 hover:bg-rose-700 text-white gap-1"
                                            onClick={() => onPay(supplier)}
                                            disabled={currentDebt <= 0}
                                        >
                                            <DollarSign className="h-3 w-3" /> Trả nợ
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
