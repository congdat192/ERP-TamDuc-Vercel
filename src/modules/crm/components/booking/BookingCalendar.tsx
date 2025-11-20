import { useState } from 'react';
import { CRMBooking } from '../../types/crm';
import { EditBookingModal } from './EditBookingModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BookingCalendarProps {
    bookings: CRMBooking[];
}

const getStatusColor = (status: CRMBooking['status']) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusLabel = (status: CRMBooking['status']) => {
    switch (status) {
        case 'confirmed': return 'Đã xác nhận';
        case 'pending': return 'Chờ xác nhận';
        case 'cancelled': return 'Đã hủy';
        case 'completed': return 'Hoàn thành';
        default: return status;
    }
};

export function BookingCalendar({ bookings }: BookingCalendarProps) {
    const [selectedBooking, setSelectedBooking] = useState<CRMBooking | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditClick = (booking: CRMBooking) => {
        setSelectedBooking(booking);
        setShowEditModal(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Lịch hẹn Sắp tới
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleEditClick(booking)}
                            >
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg text-blue-700 border border-blue-100">
                                        <span className="text-xs font-medium uppercase">
                                            {format(new Date(booking.booking_date), 'MMM', { locale: vi })}
                                        </span>
                                        <span className="text-2xl font-bold">
                                            {format(new Date(booking.booking_date), 'dd')}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-900">{booking.customer_name}</h4>
                                            <Badge variant="outline" className={getStatusColor(booking.status)}>
                                                {getStatusLabel(booking.status)}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(booking.booking_date), 'HH:mm')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {booking.branch_name}
                                            </div>
                                        </div>

                                        {booking.note && (
                                            <p className="text-sm text-gray-600 mt-1 italic">
                                                "{booking.note}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {/* Action buttons could go here */}
                                </div>
                            </div>
                        ))}

                        {bookings.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                Không có lịch hẹn nào.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <EditBookingModal
                booking={selectedBooking}
                open={showEditModal}
                onOpenChange={setShowEditModal}
                onSuccess={() => window.location.reload()}
            />
        </>
    );
}
