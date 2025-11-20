import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AISuggestionProps {
    context: 'lead' | 'customer' | 'booking';
    data?: any;
}

export function AISuggestion({ context, data }: AISuggestionProps) {
    // Mock AI Logic
    const getSuggestion = () => {
        if (context === 'lead') {
            return {
                title: 'Gợi ý hành động',
                content: 'Khách hàng này có khả năng chốt đơn cao (85%). Hãy gọi điện tư vấn gói "Combo Mắt Kính" ngay hôm nay.',
                action: 'Gọi ngay'
            };
        }
        if (context === 'customer') {
            return {
                title: 'Cơ hội bán thêm',
                content: 'Khách đã mua gọng kính 6 tháng trước. Đề xuất kiểm tra mắt định kỳ và vệ sinh kính miễn phí.',
                action: 'Gửi tin nhắn Zalo'
            };
        }
        return {
            title: 'Tối ưu lịch hẹn',
            content: 'Khung giờ 14:00 - 16:00 thường vắng khách. Hãy đề xuất khách đặt lịch vào giờ này để giảm tải.',
            action: 'Xem lịch trống'
        };
    };

    const suggestion = getSuggestion();

    return (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-base text-indigo-900">{suggestion.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-indigo-800 mb-3">{suggestion.content}</p>
                <button className="text-xs font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors">
                    {suggestion.action}
                </button>
            </CardContent>
        </Card>
    );
}
