import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRMPrescription } from '../../types/crm';
import { Eye } from 'lucide-react';

interface PrescriptionHistoryProps {
    prescriptions: CRMPrescription[];
}

export function PrescriptionHistory({ prescriptions }: PrescriptionHistoryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" /> Lịch sử đo mắt
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ngày đo</TableHead>
                            <TableHead>Mắt Phải (OD)</TableHead>
                            <TableHead>Mắt Trái (OS)</TableHead>
                            <TableHead>PD</TableHead>
                            <TableHead>Thị lực</TableHead>
                            <TableHead>Người đo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {prescriptions.map((rx) => (
                            <TableRow key={rx.id}>
                                <TableCell>{new Date(rx.exam_date).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell>
                                    <div className="text-xs">
                                        <div>SPH: {rx.sph_od}</div>
                                        <div>CYL: {rx.cyl_od}</div>
                                        <div>AX: {rx.ax_od}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs">
                                        <div>SPH: {rx.sph_os}</div>
                                        <div>CYL: {rx.cyl_os}</div>
                                        <div>AX: {rx.ax_os}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{rx.pd} mm</TableCell>
                                <TableCell>
                                    <div className="text-xs">
                                        <div>P: {rx.va_od}</div>
                                        <div>T: {rx.va_os}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{rx.prescribed_by}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
