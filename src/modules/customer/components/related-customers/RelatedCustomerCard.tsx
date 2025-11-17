import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { RelatedCustomer, RELATIONSHIP_ICONS, RELATIONSHIP_LABELS } from '../../types/relatedCustomer.types';

interface RelatedCustomerCardProps {
  related: RelatedCustomer;
  onView: (related: RelatedCustomer) => void;
}

export function RelatedCustomerCard({ related, onView }: RelatedCustomerCardProps) {
  // ✅ Lấy ảnh mới nhất (ảnh đầu tiên trong array)
  const getLatestAvatar = () => {
    if (!related.avatars || related.avatars.length === 0) return null;
    return related.avatars[0];
  };

  const formatBirthDate = (dateStr: string | null) => {
    if (!dateStr) return 'Chưa có';
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const latestAvatar = getLatestAvatar();

  return (
    <Card className="theme-card hover:shadow-lg transition-all duration-200 p-4">
      {/* Layout 2 cột */}
      <div className="flex gap-4">
        {/* Column 1: Ảnh mới nhất */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
            {latestAvatar?.public_url ? (
              <img
                src={latestAvatar.public_url}
                alt={related.related_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <span className="text-3xl text-blue-600 font-bold">
                  {related.related_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Thông tin */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Tên */}
          <div>
            <h4 className="font-semibold theme-text text-base truncate">
              {related.related_name}
            </h4>

            {/* Mối quan hệ */}
            <div className="flex items-center gap-1 text-sm theme-text-muted mt-1">
              <span>{RELATIONSHIP_ICONS[related.relationship_type]}</span>
              <span className="truncate">{RELATIONSHIP_LABELS[related.relationship_type]}</span>
            </div>

            {/* Ngày sinh */}
            <div className="text-sm theme-text-muted mt-1">
              {formatBirthDate(related.birth_date)}
            </div>
          </div>

          {/* View Button */}
          <div className="flex justify-center">
            <Button
              size="sm"
              onClick={() => onView(related)}
              className="gap-2 mt-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Eye className="w-4 h-4" />
              Xem
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
