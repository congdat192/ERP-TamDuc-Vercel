import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Phone, Calendar } from 'lucide-react';
import { CRMFamilyMember } from '../../types/crm';

interface FamilyMembersProps {
    members: CRMFamilyMember[];
}

export function FamilyMembers({ members }: FamilyMembersProps) {
    const getRelationshipLabel = (rel: string) => {
        const map: Record<string, string> = {
            spouse: 'Vợ/Chồng',
            child: 'Con cái',
            parent: 'Cha/Mẹ',
            sibling: 'Anh/Chị/Em',
            other: 'Khác'
        };
        return map[rel] || rel;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" /> Gia đình & Người thân
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-gray-500">{getRelationshipLabel(member.relationship)}</p>
                                </div>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                {member.phone && (
                                    <div className="flex items-center justify-end gap-1">
                                        <Phone className="h-3 w-3" /> {member.phone}
                                    </div>
                                )}
                                {member.dob && (
                                    <div className="flex items-center justify-end gap-1">
                                        <Calendar className="h-3 w-3" /> {new Date(member.dob).toLocaleDateString('vi-VN')}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full">
                        + Thêm thành viên
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
