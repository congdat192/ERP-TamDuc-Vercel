// Administrative Documents Types

export type DocType = 'decision' | 'notice' | 'contract' | 'form';

export type DocStatus = 'draft' | 'pending' | 'approved' | 'published' | 'archived';

export interface AdministrativeDocument {
  id: string;
  doc_type: DocType;
  doc_no: string | null;
  subject: string;
  content: string;
  issue_date: string;
  effective_date: string | null;
  status: DocStatus;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  employee_id: string | null;
  created_by: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  employee?: {
    full_name: string;
    employee_code: string;
    position: string;
    department: string;
  };
}

export interface CreateDocumentData {
  doc_type: DocType;
  subject: string;
  content: string;
  issue_date: string;
  effective_date?: string;
  employee_id?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
}

export interface UpdateDocumentData {
  subject?: string;
  content?: string;
  issue_date?: string;
  effective_date?: string;
  status?: DocStatus;
  employee_id?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  content: string;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  changed_by: string;
  change_note: string | null;
  created_at: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  doc_type: DocType;
  template_content: string;
  variables: Record<string, string>;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateData {
  name: string;
  doc_type: DocType;
  template_content: string;
  variables: Record<string, string>;
  is_active?: boolean;
}

export interface DocumentSequence {
  id: string;
  doc_type: DocType;
  year: number;
  last_number: number;
  prefix: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentFilters {
  doc_type?: DocType | 'all';
  status?: DocStatus | 'all';
  employee_id?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface DocumentStats {
  total: number;
  draft: number;
  pending: number;
  approved: number;
  published: number;
  archived: number;
  by_type: {
    decision: number;
    notice: number;
    contract: number;
    form: number;
  };
}

// Helper functions
export const getDocTypeLabel = (type: DocType): string => {
  const labels: Record<DocType, string> = {
    decision: 'Quyết Định',
    notice: 'Thông Báo',
    contract: 'Hợp Đồng',
    form: 'Biểu Mẫu',
  };
  return labels[type];
};

export const getDocTypePrefix = (type: DocType): string => {
  const prefixes: Record<DocType, string> = {
    decision: 'QĐ',
    notice: 'TB',
    contract: 'HĐ',
    form: 'BM',
  };
  return prefixes[type];
};

export const getStatusLabel = (status: DocStatus): string => {
  const labels: Record<DocStatus, string> = {
    draft: 'Nháp',
    pending: 'Chờ Duyệt',
    approved: 'Đã Duyệt',
    published: 'Đã Xuất Bản',
    archived: 'Lưu Trữ',
  };
  return labels[status];
};

export const getStatusColor = (status: DocStatus): string => {
  const colors: Record<DocStatus, string> = {
    draft: 'bg-muted text-muted-foreground',
    pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    approved: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    published: 'bg-green-500/10 text-green-700 dark:text-green-400',
    archived: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  };
  return colors[status];
};
