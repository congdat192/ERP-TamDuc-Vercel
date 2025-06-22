
export interface VoucherBatch {
  id: string;
  name: string; // Tên đợt phát hành
  description?: string; // Mô tả đợt
  codePrefix: string; // Ký tự đầu mã voucher
  codeSuffix?: string; // Ký tự cuối mã voucher
  codeLength: number; // Độ dài tổng mã voucher
  isActive: boolean;
  isDefault: boolean; // Đặt làm mặc định
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
