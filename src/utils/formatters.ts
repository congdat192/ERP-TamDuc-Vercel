export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getVoucherStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    'da_kich_hoat': 'text-green-600 bg-green-50',
    'da_su_dung': 'text-gray-600 bg-gray-50',
    'het_han': 'text-red-600 bg-red-50',
    'da_huy': 'text-orange-600 bg-orange-50'
  };
  return map[status] || 'text-gray-600 bg-gray-50';
};

export const getVoucherStatusText = (status: string): string => {
  const map: Record<string, string> = {
    'da_kich_hoat': 'Đã kích hoạt',
    'da_su_dung': 'Đã sử dụng',
    'het_han': 'Hết hạn',
    'da_huy': 'Đã hủy'
  };
  return map[status] || status;
};
