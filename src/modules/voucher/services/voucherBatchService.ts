
import { VoucherBatch } from '../types/voucherBatch';

const STORAGE_KEY = 'voucher_batches';

// Default voucher batch configurations
const getDefaultBatches = (): VoucherBatch[] => [
  {
    id: 'batch-1',
    name: 'Đợt Tết Nguyên Đán 2024',
    description: 'Chương trình khuyến mãi dịp Tết Nguyên Đán 2024',
    codePrefix: 'TET24',
    codeSuffix: 'X',
    codeLength: 8,
    isActive: true,
    createdBy: 'Hệ thống',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'batch-2',
    name: 'Đợt Khuyến Mãi VIP',
    description: 'Voucher dành riêng cho khách hàng VIP',
    codePrefix: 'VIP',
    codeSuffix: '',
    codeLength: 10,
    isActive: true,
    createdBy: 'Hệ thống',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'batch-3',
    name: 'Đợt Back to School',
    description: 'Chương trình ưu đãi mùa tựu trường',
    codePrefix: 'BTS',
    codeSuffix: 'S',
    codeLength: 6,
    isActive: true,
    createdBy: 'Hệ thống',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

export const voucherBatchService = {
  getBatches(): VoucherBatch[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const defaultBatches = getDefaultBatches();
        this.setBatches(defaultBatches);
        return defaultBatches;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading voucher batches:', error);
      const defaultBatches = getDefaultBatches();
      this.setBatches(defaultBatches);
      return defaultBatches;
    }
  },

  setBatches(batches: VoucherBatch[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
    } catch (error) {
      console.error('Error saving voucher batches:', error);
    }
  },

  addBatch(batch: VoucherBatch): VoucherBatch[] {
    const batches = this.getBatches();
    const newBatches = [...batches, batch];
    this.setBatches(newBatches);
    return newBatches;
  },

  updateBatch(id: string, updatedBatch: VoucherBatch): VoucherBatch[] {
    const batches = this.getBatches();
    const newBatches = batches.map(batch => 
      batch.id === id ? updatedBatch : batch
    );
    this.setBatches(newBatches);
    return newBatches;
  },

  deleteBatch(id: string): VoucherBatch[] {
    const batches = this.getBatches();
    const newBatches = batches.filter(batch => batch.id !== id);
    this.setBatches(newBatches);
    return newBatches;
  },

  getBatchById(id: string): VoucherBatch | undefined {
    const batches = this.getBatches();
    return batches.find(batch => batch.id === id);
  }
};
