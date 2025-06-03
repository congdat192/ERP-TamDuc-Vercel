
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Package, 
  Users, 
  Plus
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface License {
  id: string;
  tenantName: string;
  moduleName: string;
  status: 'active' | 'expired' | 'suspended';
  expiryDate: Date;
  userLimit: number;
  usedUsers: number;
}

export function ModuleLicensing() {
  const [licenses] = useState<License[]>([
    {
      id: '1',
      tenantName: 'ABC Technology',
      moduleName: 'ERP Core',
      status: 'active',
      expiryDate: new Date('2024-12-31'),
      userLimit: 50,
      usedUsers: 35
    },
    {
      id: '2',
      tenantName: 'XYZ Corporation', 
      moduleName: 'CRM Module',
      status: 'active',
      expiryDate: new Date('2024-11-30'),
      userLimit: 25,
      usedUsers: 18
    },
    {
      id: '3',
      tenantName: 'DEF Solutions',
      moduleName: 'Trial Package',
      status: 'expired',
      expiryDate: new Date('2024-10-30'),
      userLimit: 10,
      usedUsers: 8
    }
  ]);

  const getStatusBadge = (status: License['status']) => {
    const config = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      expired: { label: 'Expired', className: 'bg-red-100 text-red-800' },
      suspended: { label: 'Suspended', className: 'bg-yellow-100 text-yellow-800' }
    };
    const { label, className } = config[status];
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">License Management</h1>
          <p className="text-gray-600">Manage tenant licenses and subscriptions</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New License
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Licenses</p>
                <p className="text-xl font-bold">{licenses.filter(l => l.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Licenses</p>
                <p className="text-xl font-bold">{licenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Licensed Users</p>
                <p className="text-xl font-bold">{licenses.reduce((sum, l) => sum + l.usedUsers, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* License List */}
      <Card>
        <CardHeader>
          <CardTitle>License Overview</CardTitle>
          <CardDescription>
            Manage and monitor all tenant licenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">{license.tenantName}</TableCell>
                  <TableCell>{license.moduleName}</TableCell>
                  <TableCell>{getStatusBadge(license.status)}</TableCell>
                  <TableCell>
                    <span className={license.usedUsers >= license.userLimit ? 'text-red-600' : 'text-gray-900'}>
                      {license.usedUsers}/{license.userLimit}
                    </span>
                  </TableCell>
                  <TableCell>{license.expiryDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
