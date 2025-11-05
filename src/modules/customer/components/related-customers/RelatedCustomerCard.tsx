import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { RelatedCustomer, RELATIONSHIP_ICONS, RELATIONSHIP_LABELS } from '../../types/relatedCustomer.types';

interface RelatedCustomerCardProps {
  related: RelatedCustomer;
  onView: (related: RelatedCustomer) => void;
}

export function RelatedCustomerCard({ related, onView }: RelatedCustomerCardProps) {
  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPrimaryAvatar = () => {
    if (!related.avatars || related.avatars.length === 0) return null;
    const primary = related.avatars.find(a => a.is_primary);
    return primary || related.avatars[0];
  };

  const formatBirthDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const primaryAvatar = getPrimaryAvatar();

  return (
    <Card className="theme-card hover:shadow-lg transition-all duration-200 p-4 flex flex-col items-center space-y-3">
      {/* Avatar */}
      <Avatar className="w-20 h-20 border-4 border-white shadow-md ring-2 ring-gray-200">
        {primaryAvatar?.public_url ? (
          <AvatarImage 
            src={primaryAvatar.public_url} 
            alt={related.related_name}
            className="object-cover"
          />
        ) : null}
        <AvatarFallback className="theme-bg-primary text-white text-lg font-semibold">
          {getInitials(related.related_name)}
        </AvatarFallback>
      </Avatar>

      {/* Name */}
      <div className="text-center">
        <h4 className="font-semibold theme-text">{related.related_name}</h4>
      </div>

      {/* Relationship */}
      <div className="flex items-center gap-2 text-sm theme-text-muted">
        <span className="text-lg">{RELATIONSHIP_ICONS[related.relationship_type]}</span>
        <span>{RELATIONSHIP_LABELS[related.relationship_type]}</span>
      </div>

      {/* Birth Date */}
      {related.birth_date && (
        <div className="text-sm theme-text-muted">
          {formatBirthDate(related.birth_date)}
        </div>
      )}

      {/* View Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(related)}
        className="w-full gap-2"
      >
        <Eye className="w-4 h-4" />
        Xem
      </Button>
    </Card>
  );
}
