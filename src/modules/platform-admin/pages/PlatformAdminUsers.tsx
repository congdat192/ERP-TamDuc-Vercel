
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Users, 
  MoreHorizontal,
  Shield,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PlatformAdmin {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'super-admin' | 'platform-admin';
  status: 'active' | 'inactive';
  lastLogin: Date;
  createdAt: Date;
}

export function PlatformAdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [admins] = useState<PlatformAdmin[]>([
    {
      id: '1',
      username: 'super.admin',
      fullName: 'Super Administrator',
      email: 'super@platform.com',
      role: 'super-admin',
      status: 'active',
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      username: 'platform.admin',
      fullName: 'Platform Administrator',
      email: 'admin@platform.com',
      role: 'platform-admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 86400000),
      createdAt: new Date('2024-02-15')
    }
  ]);

  const filteredAdmins = admins.filter(admin =>
    admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: PlatformAdmin['status']) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
  };

  const getRoleBadge = (role: PlatformAdmin['role']) => {
    return role === 'super-admin'
      ? <Badge className="bg-red-100 text-red-800">Super Admin</Badge>
      : <Badge className="bg-blue-100 text-blue-800">Platform Admin</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Accounts</h1>
          <p className="text-gray-600">Manage platform administrator accounts</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Super Admins</p>
                <p className="text-xl font-bold">{admins.filter(a => a.role === 'super-admin').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Platform Admins</p>
                <p className="text-xl font-bold">{admins.filter(a => a.role === 'platform-admin').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Accounts</p>
                <p className="text-xl font-bold">{admins.filter(a => a.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Administrator Accounts</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{admin.fullName}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell>{getStatusBadge(admin.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {admin.lastLogin.toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
