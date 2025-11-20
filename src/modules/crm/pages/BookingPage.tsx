import { useEffect, useState } from 'react';
import { crmService } from '../services/crmService';
import { CRMBooking } from '../types/crm';
import { BookingCalendar } from '../components/booking/BookingCalendar';
import { CreateBookingModal } from '../components/booking/CreateBookingModal';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';

export function BookingPage() {
    const [bookings, setBookings] = useState<CRMBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await crmService.getBookings();
                setBookings(data);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn (Booking)</h1>
                    <p className="text-sm text-gray-500">Theo dõi lịch đo mắt và bảo hành tại các chi nhánh.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => window.location.reload()} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <CreateBookingModal onSuccess={() => window.location.reload()} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BookingCalendar bookings={bookings} />
                </div>

                <div className="lg:col-span-1">
                    {/* Placeholder for mini calendar or stats */}
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" /> Thống kê hôm nay
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Tổng lịch hẹn</span>
                                <span className="font-bold">5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Đã xác nhận</span>
                                <span className="font-bold text-green-600">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Chờ xử lý</span>
                                <span className="font-bold text-yellow-600">2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
