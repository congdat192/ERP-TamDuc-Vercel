import { RelatedCustomer } from '../types/relatedCustomer.types';

/**
 * MOCKUP DATA for Related Customers
 * Simulate API responses for UI/UX testing
 */

export const MOCK_RELATED_CUSTOMERS: RelatedCustomer[] = [
  {
    id: '1',
    customer_phone: '0987654321',
    customer_code: 'KH001',
    customer_name: 'Nguyễn Văn A',
    customer_group: 'Khách VIP',
    related_code: 'NT001',
    related_name: 'Nguyễn Văn B',
    relationship_type: 'con_cai',
    gender: 'Nam',
    birth_date: '2015-05-15',
    phone: '0912345678',
    notes: 'Con trai đầu',
    created_by: 'admin@tamduc.com',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    deleted_at: null,
    avatars: [
      {
        id: 'avatar-1',
        related_id: '1',
        storage_bucket: 'related-avatars',
        storage_path: 'avatars/1/photo.jpg',
        file_name: 'photo.jpg',
        file_size: 152400,
        mime_type: 'image/jpeg',
        public_url: 'https://placehold.co/200x200/e3f2fd/1976d2?text=NVB',
        uploaded_at: '2024-01-15T10:00:00Z',
        uploaded_by: 'admin@tamduc.com',
        is_primary: true
      }
    ]
  },
  {
    id: '2',
    customer_phone: '0987654321',
    customer_code: 'KH001',
    customer_name: 'Nguyễn Văn A',
    customer_group: 'Khách VIP',
    related_code: 'NT002',
    related_name: 'Nguyễn Thị C',
    relationship_type: 'con_cai',
    gender: 'Nữ',
    birth_date: '2018-03-20',
    phone: null,
    notes: 'Con gái thứ 2',
    created_by: 'admin@tamduc.com',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    deleted_at: null,
    avatars: [
      {
        id: 'avatar-2',
        related_id: '2',
        storage_bucket: 'related-avatars',
        storage_path: 'avatars/2/photo.jpg',
        file_name: 'photo.jpg',
        file_size: 145800,
        mime_type: 'image/jpeg',
        public_url: 'https://placehold.co/200x200/f3e5f5/8e24aa?text=NTC',
        uploaded_at: '2024-01-16T10:00:00Z',
        uploaded_by: 'admin@tamduc.com',
        is_primary: true
      }
    ]
  },
  {
    id: '3',
    customer_phone: '0987654321',
    customer_code: 'KH001',
    customer_name: 'Nguyễn Văn A',
    customer_group: 'Khách VIP',
    related_code: 'NT003',
    related_name: 'Trần Thị D',
    relationship_type: 'vo_chong',
    gender: 'Nữ',
    birth_date: '1985-11-10',
    phone: '0923456789',
    notes: 'Vợ',
    created_by: 'admin@tamduc.com',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    deleted_at: null,
    avatars: []
  },
  {
    id: '4',
    customer_phone: '0912345678',
    customer_code: 'KH002',
    customer_name: 'Lê Thị E',
    customer_group: 'Khách thường',
    related_code: 'NT004',
    related_name: 'Lê Văn F',
    relationship_type: 'anh_chi_em',
    gender: 'Nam',
    birth_date: '1990-07-25',
    phone: '0934567890',
    notes: 'Anh trai',
    created_by: 'admin@tamduc.com',
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
    deleted_at: null,
    avatars: [
      {
        id: 'avatar-4',
        related_id: '4',
        storage_bucket: 'related-avatars',
        storage_path: 'avatars/4/photo.jpg',
        file_name: 'photo.jpg',
        file_size: 168200,
        mime_type: 'image/jpeg',
        public_url: 'https://placehold.co/200x200/e8f5e9/43a047?text=LVF',
        uploaded_at: '2024-02-01T10:00:00Z',
        uploaded_by: 'admin@tamduc.com',
        is_primary: true
      }
    ]
  },
  {
    id: '5',
    customer_phone: '0912345678',
    customer_code: 'KH002',
    customer_name: 'Lê Thị E',
    customer_group: 'Khách thường',
    related_code: 'NT005',
    related_name: 'Phạm Văn G',
    relationship_type: 'ong_ba',
    gender: 'Nam',
    birth_date: '1950-01-15',
    phone: null,
    notes: 'Ông nội',
    created_by: 'admin@tamduc.com',
    created_at: '2024-02-05T10:00:00Z',
    updated_at: '2024-02-05T10:00:00Z',
    deleted_at: null,
    avatars: []
  }
];

/**
 * Simulate API delay
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
let mockIdCounter = 100;
const generateMockId = () => String(mockIdCounter++);

/**
 * Generate related_code
 */
let mockCodeCounter = 100;
const generateRelatedCode = () => `NT${String(mockCodeCounter++).padStart(3, '0')}`;

/**
 * Mockup API Service
 */
export class MockRelatedCustomerAPI {
  private static data: RelatedCustomer[] = [...MOCK_RELATED_CUSTOMERS];

  /**
   * Get related customers by customer phone
   */
  static async getByCustomerPhone(customerPhone: string): Promise<RelatedCustomer[]> {
    await delay(800);
    return this.data.filter(r => 
      r.customer_phone === customerPhone && !r.deleted_at
    );
  }

  /**
   * Create new related customer
   */
  static async create(data: any): Promise<RelatedCustomer> {
    await delay(1000);
    
    const newRelated: RelatedCustomer = {
      id: generateMockId(),
      customer_phone: data.customer_phone,
      customer_code: data.customer_code,
      customer_name: data.customer_name,
      customer_group: data.customer_group,
      related_code: generateRelatedCode(),
      related_name: data.related_name,
      relationship_type: data.relationship_type,
      gender: data.gender,
      birth_date: data.birth_date,
      phone: data.phone || null,
      notes: data.notes || null,
      created_by: data.created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      avatars: []
    };

    this.data.push(newRelated);
    return newRelated;
  }

  /**
   * Update related customer
   */
  static async update(id: string, data: any): Promise<RelatedCustomer> {
    await delay(800);
    
    const index = this.data.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Không tìm thấy người thân');

    const updated = {
      ...this.data[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    this.data[index] = updated;
    return updated;
  }

  /**
   * Delete related customer (soft delete)
   */
  static async delete(id: string): Promise<void> {
    await delay(600);
    
    const index = this.data.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Không tìm thấy người thân');

    this.data[index] = {
      ...this.data[index],
      deleted_at: new Date().toISOString()
    };
  }

  /**
   * Reset mock data (for testing)
   */
  static reset() {
    this.data = [...MOCK_RELATED_CUSTOMERS];
    mockIdCounter = 100;
    mockCodeCounter = 100;
  }
}
