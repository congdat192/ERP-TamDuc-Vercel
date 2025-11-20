import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRMPrescription } from '../../types/crm';

interface PrescriptionChartProps {
    prescriptions: CRMPrescription[];
}

export function PrescriptionChart({ prescriptions }: PrescriptionChartProps) {
    // Sort by date ascending for the chart
    const data = [...prescriptions]
        .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
        .map(p => ({
            date: new Date(p.exam_date).toLocaleDateString('vi-VN'),
            sph_od: p.sph_od,
            sph_os: p.sph_os,
        }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Biểu đồ thay đổi độ cận (SPH)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis label={{ value: 'Diopter', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sph_od" name="Mắt Phải (OD)" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="sph_os" name="Mắt Trái (OS)" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
