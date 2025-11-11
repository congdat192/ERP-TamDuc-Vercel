// ================================================================
// INPUT VALIDATORS
// ================================================================
/**
 * Validate request payload structure
 */ export function validateRequestPayload(payload) {
  // Check required fields
  if (!payload.action) {
    return {
      valid: false,
      error: 'Missing required field: action'
    };
  } 
  if (!payload.customer_sdt) {
    return {
      valid: false,
      error: 'Missing required field: customer_sdt'
    };
  }
  // Validate action
  const validActions = [
    'add',
    'update',
    'rename',
    'delete',
    'add_image',
    'delete_image',
    'assign_bills',
    'unassign_bill'
  ];
  if (!validActions.includes(payload.action)) {
    return {
      valid: false,
      error: `Invalid action. Must be one of: ${validActions.join(', ')}`
    };
  }
  // Validate action-specific requirements
  switch(payload.action){
    case 'add':
      if (!payload.nguoi_than || !payload.nguoi_than.ten) {
        return {
          valid: false,
          error: 'Missing required field: nguoi_than.ten for add action'
        };
      }
      if (!payload.nguoi_than.moi_quan_he) {
        return {
          valid: false,
          error: 'Missing required field: nguoi_than.moi_quan_he for add action'
        };
      }
      if (!payload.nguoi_than.gioi_tinh) {
        return {
          valid: false,
          error: 'Missing required field: nguoi_than.gioi_tinh for add action'
        };
      }
      break;
    case 'update':
    case 'delete':
    case 'add_image':
    case 'delete_image':
      if (!payload.nguoi_than || !payload.nguoi_than.ten) {
        return {
          valid: false,
          error: 'Missing required field: nguoi_than.ten'
        };
      }
      break;
    case 'rename':
      if (!payload.ten_cu || !payload.ten_moi) {
        return {
          valid: false,
          error: 'Missing required fields: ten_cu and ten_moi for rename action'
        };
      }
      break;
    case 'assign_bills':
      if (!payload.nguoi_than || !payload.nguoi_than.hoadon_ids || !Array.isArray(payload.nguoi_than.hoadon_ids)) {
        return {
          valid: false,
          error: 'Missing or invalid field: nguoi_than.hoadon_ids (must be array)'
        };
      }
      break;
    case 'unassign_bill':
      if (!payload.nguoi_than || !payload.nguoi_than.hoadon_id) {
        return {
          valid: false,
          error: 'Missing required field: nguoi_than.hoadon_id'
        };
      }
      break;
  }
  return {
    valid: true,
    data: payload
  };
}
/**
 * Validate phone number format
 */ export function validatePhoneNumber(phone) {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Vietnamese phone numbers: 10-11 digits, starting with 0
  return /^0\d{9,10}$/.test(cleaned);
}
/**
 * Clean phone number (remove non-digits)
 */ export function cleanPhoneNumber(phone) {
  return phone.replace(/\D/g, '');
}
/**
 * Validate date format (YYYY-MM-DD)
 */ export function validateDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
/**
 * Validate moi_quan_he value
 */ export function validateMoiQuanHe(value) {
  const validValues = [
    'con_cai',
    'vo_chong',
    'anh_chi_em',
    'ong_ba',
    'khac'
  ];
  return validValues.includes(value);
}
/**
 * Validate gioi_tinh value
 */ export function validateGioiTinh(value) {
  return value === 'nam' || value === 'nu';
}
