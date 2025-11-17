# API - Commission Tracking for Customer Service (CSKH)

## 🔗 Endpoint

```
GET https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh
```

## 🔐 Authentication

**Headers (BẮT BUỘC):**
```http
Authorization: Bearer <access_token>
```

**Token Validation:**
- Token must NOT be revoked (`revoked = false`)
- Token must NOT be expired (`expires_at_vn > NOW()`)
- Token is validated against `api.oauth_tokens` table

**RBAC Permission Required:**
- Resource: `hoahong.hoahong_cskh`
- Operation: `read`
- Permission check: Exact match FIRST, then wildcard match

---

## 📋 Query Parameters

### 1. `creatorphone` (BẮT BUỘC)
```
?creatorphone=0912345678
```
- **Kiểu**: String
- **Required**: YES
- **Validation**: Must match regex `/^(0[3-9])[0-9]{8}$/` (10 digits, starts with 0)
- **Mô tả**: Số điện thoại của nhân viên CSKH

### 2. `fromdate` (Tùy chọn)
```
?fromdate=2025-01-01
```
- **Kiểu**: String
- **Required**: NO
- **Default**: First day of current month (YYYY-MM-01)
- **Format**: YYYY-MM-DD
- **Mô tả**: Lọc từ ngày này (inclusive, `>=`)

### 3. `todate` (Tùy chọn)
```
?todate=2025-01-31
```
- **Kiểu**: String
- **Required**: NO
- **Default**: Today in Vietnam timezone
- **Format**: YYYY-MM-DD
- **Mô tả**: Lọc đến ngày này (inclusive, `<=`)

### 4. `page` (Tùy chọn)
```
?page=1
```
- **Kiểu**: Number
- **Required**: NO
- **Default**: 1
- **Mô tả**: Trang hiện tại (bắt đầu từ 1)

### 5. `pagesize` (Tùy chọn)
```
?pagesize=50
```
- **Kiểu**: Number
- **Required**: NO
- **Default**: 10
- **Max**: 200
- **Mô tả**: Số lượng records trên mỗi trang

---

## ✅ Success Response (200)

**CRITICAL**: Response structure CHÍNH XÁC như code định nghĩa!

### Response Structure:

```typescript
interface SuccessResponse {
  success: true;
  creator_phone: string;
  period: {
    from: string;  // YYYY-MM-DD
    to: string;    // YYYY-MM-DD
  };
  summary: {
    total_revenue: number;
    total_orders: number;
    total_vouchers: number;
    breakdown: {
      new_customers: {
        revenue: number;
        orders: number;
      };
      old_customers: {
        revenue: number;
        orders: number;
      };
    };
  };
  pagination: {
    page: number;
    pagesize: number;
    total: number;
  };
}
```

### Example Response (CHÍNH XÁC 100% từ code):

```json
{
  "success": true,
  "creator_phone": "0912345678",
  "period": {
    "from": "2025-01-01",
    "to": "2025-01-31"
  },
  "summary": {
    "total_revenue": 8800000,
    "total_orders": 27,
    "total_vouchers": 55,
    "breakdown": {
      "new_customers": {
        "revenue": 4000000,
        "orders": 12
      },
      "old_customers": {
        "revenue": 4800000,
        "orders": 15
      }
    }
  },
  "pagination": {
    "page": 1,
    "pagesize": 10,
    "total": 2
  }
}
```

**📊 GIẢI THÍCH CÁC FIELDS:**

| Field | Kiểu | Mô tả | Ví dụ |
|-------|------|-------|-------|
| `success` | boolean | Luôn là `true` trong success response | `true` |
| `creator_phone` | string | Phone của CSKH (lấy từ query param) | `"0912345678"` |
| `period.from` | string | Ngày bắt đầu kỳ tính (YYYY-MM-DD) | `"2025-01-01"` |
| `period.to` | string | Ngày kết thúc kỳ tính (YYYY-MM-DD) | `"2025-01-31"` |
| `summary.total_revenue` | number | Tổng doanh thu TOÀN BỘ (sum of all rows) | `8800000` |
| `summary.total_orders` | number | Tổng số đơn hàng TOÀN BỘ (sum of all rows) | `27` |
| `summary.total_vouchers` | number | Tổng voucher phát hành TOÀN BỘ (sum of all rows) | `55` |
| `summary.breakdown.new_customers.revenue` | number | Doanh thu từ KHÁCH MỚI (sum across all rows) | `4000000` |
| `summary.breakdown.new_customers.orders` | number | Số đơn của KHÁCH MỚI (sum across all rows) | `12` |
| `summary.breakdown.old_customers.revenue` | number | Doanh thu từ KHÁCH CŨ (sum across all rows) | `4800000` |
| `summary.breakdown.old_customers.orders` | number | Số đơn của KHÁCH CŨ (sum across all rows) | `15` |
| `pagination.page` | number | Trang hiện tại (từ query param) | `1` |
| `pagination.pagesize` | number | Số records/trang (từ query param) | `10` |
| `pagination.total` | number | Tổng số records TOÀN BỘ trong database (match filter) | `2` |

**🔢 TÍNH TOÁN SUMMARY:**

API thực hiện **AGGREGATE** (sum) trên TẤT CẢ rows match filter:
```
total_revenue = SUM(row.total_revenue)
total_orders = SUM(row.total_orders)
total_vouchers = SUM(row.total_vouchers_issued)
breakdown.new_customers.revenue = SUM(row.customer_breakdown.new.revenue)
breakdown.new_customers.orders = SUM(row.customer_breakdown.new.orders)
breakdown.old_customers.revenue = SUM(row.customer_breakdown.old.revenue)
breakdown.old_customers.orders = SUM(row.customer_breakdown.old.orders)
```

**⚠️ LƯU Ý QUAN TRỌNG:**
- `summary` là TỔNG của TẤT CẢ records matching filter (KHÔNG CHỈ current page!)
- `pagination.total` là số lượng records thỏa mãn filter
- Database QUERY ALL rows để tính summary, RỒI MỚI paginate
- Nếu có 100 rows nhưng pagesize=10, summary vẫn tính trên 100 rows

---

### Example Response - Không có dữ liệu (Empty):

```json
{
  "success": true,
  "creator_phone": "0912345678",
  "period": {
    "from": "2025-01-01",
    "to": "2025-01-31"
  },
  "summary": {
    "total_revenue": 0,
    "total_orders": 0,
    "total_vouchers": 0,
    "breakdown": {
      "new_customers": {
        "revenue": 0,
        "orders": 0
      },
      "old_customers": {
        "revenue": 0,
        "orders": 0
      }
    }
  },
  "pagination": {
    "page": 1,
    "pagesize": 10,
    "total": 0
  }
}
```

**📌 ĐIỂM KHÁC BIỆT:**
- Vẫn trả về `success: true` (KHÔNG phải error!)
- Tất cả số liệu đều `0`
- `pagination.total = 0` (không có records)

**Response Headers:**
```http
Content-Type: application/json
X-Request-ID: uuid
X-Response-Time: 153ms
Access-Control-Allow-Origin: *
```

---

## ❌ Error Responses

**QUAN TRỌNG**: Tất cả error responses PHẢI được xử lý CHÍNH XÁC 100% theo format dưới đây.

### Error Response Structure:

```typescript
interface ErrorResponse {
  success: false;
  error: string;  // Error message (KHÔNG có field "error_description")
}
```

---

### 1. Missing/Invalid Authorization (401)

**Khi nào:** 
- Thiếu Authorization header
- Header không bắt đầu bằng "Bearer "
- Token không tồn tại trong database
- Token đã bị revoke
- Token đã hết hạn

```json
{
  "success": false,
  "error": "Missing or invalid Authorization header"
}
```

HOẶC

```json
{
  "success": false,
  "error": "Token is invalid, expired, or revoked"
}
```

**Status Code:** `401`

---

### 2. Insufficient Permissions (403)

**Khi nào:** Client không có quyền `read` trên resource `hoahong.hoahong_cskh`

```json
{
  "success": false,
  "error": "No read access to hoahong.hoahong_cskh"
}
```

**Status Code:** `403`

---

### 3. Missing Required Parameter (400)

**Khi nào:** Thiếu parameter `creatorphone`

```json
{
  "success": false,
  "error": "Missing required parameter: creatorphone"
}
```

**Status Code:** `400`

---

### 4. Invalid Phone Format (400)

**Khi nào:** `creatorphone` không match regex `/^(0[3-9])[0-9]{8}$/`

```json
{
  "success": false,
  "error": "Invalid phone number format"
}
```

**Status Code:** `400`

---

### 5. Internal Server Error (500)

**Khi nào:** Lỗi server hoặc database

```json
{
  "success": false,
  "error": "Internal server error"
}
```

HOẶC (nếu có error message cụ thể):

```json
{
  "success": false,
  "error": "Specific error message from exception"
}
```

**Status Code:** `500`

---

## 🎯 Request Examples

### Example 1: Basic Query (Only Required Parameter)
```bash
curl -X GET "https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh?creatorphone=0912345678" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Default behavior:**
- `fromdate`: First day of current month
- `todate`: Today
- `page`: 1
- `pagesize`: 10

---

### Example 2: With Date Range
```bash
curl -X GET "https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh?creatorphone=0912345678&fromdate=2025-01-01&todate=2025-01-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Example 3: With Pagination
```bash
curl -X GET "https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh?creatorphone=0912345678&page=2&pagesize=50" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Example 4: Full Query
```bash
curl -X GET "https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh?creatorphone=0912345678&fromdate=2025-01-01&todate=2025-01-31&page=1&pagesize=100" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 💻 Frontend Implementation Guide

### TypeScript Types (CHÍNH XÁC 100% - BẮT BUỘC SỬ DỤNG)

```typescript
/**
 * CUSTOMER BREAKDOWN
 * Chứa thông tin chia theo khách hàng mới/cũ
 */
interface CustomerBreakdown {
  new_customers: {
    revenue: number;  // Doanh thu từ khách mới
    orders: number;   // Số đơn của khách mới
  };
  old_customers: {
    revenue: number;  // Doanh thu từ khách cũ
    orders: number;   // Số đơn của khách cũ
  };
}

/**
 * SUMMARY DATA
 * Tổng hợp TẤT CẢ rows matching filter (không chỉ current page)
 */
interface SummaryData {
  total_revenue: number;     // Sum của total_revenue
  total_orders: number;      // Sum của total_orders
  total_vouchers: number;    // Sum của total_vouchers_issued
  breakdown: CustomerBreakdown;  // Breakdown theo khách mới/cũ
}

/**
 * PERIOD
 * Kỳ thời gian query
 */
interface Period {
  from: string;  // YYYY-MM-DD (lấy từ query param hoặc default)
  to: string;    // YYYY-MM-DD (lấy từ query param hoặc default)
}

/**
 * PAGINATION
 * Thông tin phân trang
 */
interface Pagination {
  page: number;      // Trang hiện tại (1-indexed)
  pagesize: number;  // Số records/page
  total: number;     // TỔNG số records match filter trong DB
}

/**
 * SUCCESS RESPONSE
 * Response khi API call thành công
 */
interface APISuccessResponse {
  success: true;              // Luôn là true
  creator_phone: string;      // Phone của CSKH (từ query param)
  period: Period;             // Kỳ thời gian
  summary: SummaryData;       // Tổng hợp dữ liệu (sum ALL rows)
  pagination: Pagination;     // Thông tin phân trang
}

/**
 * ERROR RESPONSE
 * Response khi có lỗi
 * LƯU Ý: CHỈ có field "error", KHÔNG có "error_description"
 */
interface APIErrorResponse {
  success: false;   // Luôn là false
  error: string;    // Error message (KHÔNG có error_description)
}

/**
 * COMBINED RESPONSE TYPE
 * Dùng để type-check response
 */
type APIResponse = APISuccessResponse | APIErrorResponse;

/**
 * TYPE GUARD HELPER
 * Kiểm tra response có phải success không
 */
function isSuccessResponse(response: APIResponse): response is APISuccessResponse {
  return response.success === true;
}

/**
 * TYPE GUARD HELPER
 * Kiểm tra response có phải error không
 */
function isErrorResponse(response: APIResponse): response is APIErrorResponse {
  return response.success === false;
}
```

**⚠️ QUAN TRỌNG - PHẢI NHỚ:**

1. **Error response CHỈ có 2 fields:**
   ```typescript
   { success: false, error: string }
   ```
   KHÔNG CÓ `error_description`!

2. **Summary tính trên TẤT CẢ rows:**
   - Không phải chỉ current page
   - Database query all, tính sum, rồi mới paginate

3. **Pagination.total:**
   - Là TỔNG số records trong database matching filter
   - KHÔNG phải số records trong current page
   - Có thể = 0 nếu không có data (vẫn success)

4. **Empty data vẫn success:**
   ```typescript
   {
     success: true,
     summary: { total_revenue: 0, total_orders: 0, ... },
     pagination: { total: 0, ... }
   }
   ```

---

### Error Handling Pattern (BẮT BUỘC)

```typescript
async function fetchCommissionData(
  token: string,
  creatorPhone: string,
  options?: {
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<APIResponse> {
  try {
    // Build query string
    const params = new URLSearchParams({
      creatorphone: creatorPhone,
    });
    
    if (options?.fromDate) params.append('fromdate', options.fromDate);
    if (options?.toDate) params.append('todate', options.toDate);
    if (options?.page) params.append('page', options.page.toString());
    if (options?.pageSize) params.append('pagesize', options.pageSize.toString());

    const response = await fetch(
      `https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const data: APIResponse = await response.json();

    // KIỂM TRA success FIELD TRƯỚC
    if (!data.success) {
      // XỬ LÝ LỖI - Hiển thị error NGUYÊN VĂN
      console.error('API Error:', data.error);
      
      // Handle specific errors
      if (data.error.includes('Missing or invalid Authorization')) {
        // Redirect to login or refresh token
      } else if (data.error.includes('No read access')) {
        // Show permission denied message
      } else if (data.error.includes('Missing required parameter')) {
        // Show validation error
      } else if (data.error.includes('Invalid phone number')) {
        // Show phone format error
      }
      
      return data;
    }

    // SUCCESS - Sử dụng data
    console.log('Total Revenue:', data.summary.total_revenue);
    console.log('New Customers Revenue:', data.summary.breakdown.new_customers.revenue);
    console.log('Old Customers Revenue:', data.summary.breakdown.old_customers.revenue);
    console.log('Total Records:', data.pagination.total);
    
    return data;
    
  } catch (error) {
    // Network error hoặc JSON parse error
    console.error('Network Error:', error);
    throw error;
  }
}
```

---

### Usage Example (BEST PRACTICES)

```typescript
// Example 1: Fetch current month data với FULL error handling
const result = await fetchCommissionData(
  accessToken,
  '0912345678'
);

// ✅ ĐÚNG: Sử dụng type guard
if (isSuccessResponse(result)) {
  // TypeScript biết result là APISuccessResponse
  const { summary, period, pagination } = result;
  
  console.log(`=== Báo cáo hoa hồng CSKH: ${result.creator_phone} ===`);
  console.log(`Kỳ: ${period.from} → ${period.to}`);
  console.log('');
  
  // Format tiền VND
  const formatVND = (amount: number) => 
    amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  
  console.log(`📊 TỔNG QUAN:`);
  console.log(`  • Doanh thu: ${formatVND(summary.total_revenue)}`);
  console.log(`  • Đơn hàng: ${summary.total_orders}`);
  console.log(`  • Voucher phát hành: ${summary.total_vouchers}`);
  console.log('');
  
  console.log(`👤 KHÁCH HÀNG MỚI:`);
  console.log(`  • Đơn: ${summary.breakdown.new_customers.orders}`);
  console.log(`  • Doanh thu: ${formatVND(summary.breakdown.new_customers.revenue)}`);
  const newPercent = summary.total_revenue > 0 
    ? ((summary.breakdown.new_customers.revenue / summary.total_revenue) * 100).toFixed(1)
    : '0.0';
  console.log(`  • Tỷ lệ: ${newPercent}%`);
  console.log('');
  
  console.log(`🔄 KHÁCH HÀNG CŨ:`);
  console.log(`  • Đơn: ${summary.breakdown.old_customers.orders}`);
  console.log(`  • Doanh thu: ${formatVND(summary.breakdown.old_customers.revenue)}`);
  const oldPercent = summary.total_revenue > 0 
    ? ((summary.breakdown.old_customers.revenue / summary.total_revenue) * 100).toFixed(1)
    : '0.0';
  console.log(`  • Tỷ lệ: ${oldPercent}%`);
  console.log('');
  
  console.log(`📄 Trang ${pagination.page}/${Math.ceil(pagination.total / pagination.pagesize)}`);
  console.log(`   Tổng ${pagination.total} records`);
  
  // ⚠️ XỬ LÝ TRƯỜNG HỢP EMPTY
  if (pagination.total === 0) {
    console.log('');
    console.log('⚠️  Không có dữ liệu trong kỳ này');
  }
  
} else if (isErrorResponse(result)) {
  // TypeScript biết result là APIErrorResponse
  console.error('❌ Lỗi API:', result.error);
  
  // Handle specific errors
  if (result.error.includes('Missing or invalid Authorization')) {
    // Redirect to login
    console.log('→ Chuyển đến trang đăng nhập');
  } else if (result.error.includes('No read access')) {
    // Show permission denied
    console.log('→ Bạn không có quyền truy cập');
  } else if (result.error.includes('Missing required parameter')) {
    // Validation error
    console.log('→ Thiếu tham số bắt buộc');
  } else if (result.error.includes('Invalid phone number')) {
    // Phone format error
    console.log('→ Số điện thoại không đúng định dạng');
  } else {
    // Generic error
    console.log('→ Lỗi không xác định');
  }
}
```

---

### Example 2: Fetch với Custom Date Range + Pagination

```typescript
const result = await fetchCommissionData(
  accessToken,
  '0912345678',
  {
    fromDate: '2025-01-01',
    toDate: '2025-01-31',
    page: 2,
    pageSize: 50
  }
);

if (isSuccessResponse(result)) {
  console.log(`Trang ${result.pagination.page} - Hiển thị 50/${result.pagination.total}`);
  console.log(`Tổng doanh thu tháng 1: ${result.summary.total_revenue}`);
}
```

---

### Example 3: Calculate Tổng số trang

```typescript
if (isSuccessResponse(result)) {
  const { page, pagesize, total } = result.pagination;
  const totalPages = Math.ceil(total / pagesize);
  
  console.log(`Đang ở trang ${page}/${totalPages}`);
  
  // Check có page tiếp theo không
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  if (hasNextPage) {
    console.log('→ Có thể load trang tiếp theo');
  }
  
  if (hasPrevPage) {
    console.log('← Có thể quay lại trang trước');
  }
}
```

---

### Example 4: Validate Input trước khi gọi API

```typescript
function validateAndFetchCommission(
  token: string,
  phone: string,
  fromDate?: string,
  toDate?: string
): Promise<APIResponse> {
  // Validate phone
  if (!/^(0[3-9])[0-9]{8}$/.test(phone)) {
    throw new Error('Số điện thoại không đúng định dạng (phải bắt đầu bằng 0 và có 10 số)');
  }
  
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (fromDate && !dateRegex.test(fromDate)) {
    throw new Error('fromDate phải có format YYYY-MM-DD');
  }
  if (toDate && !dateRegex.test(toDate)) {
    throw new Error('toDate phải có format YYYY-MM-DD');
  }
  
  // Validate date range
  if (fromDate && toDate && fromDate > toDate) {
    throw new Error('fromDate không được lớn hơn toDate');
  }
  
  return fetchCommissionData(token, phone, { fromDate, toDate });
}
```

---

## 🚨 YÊU CẦU BẮT BUỘC CHO FRONTEND

### ✅ PHẢI LÀM

1. **LUÔN kiểm tra `success` field trước khi xử lý**
   ```typescript
   if (!data.success) {
     // Handle error with data.error
   }
   ```

2. **Hiển thị `error` NGUYÊN VĂN khi có lỗi**
   - KHÔNG được tự ý format lại message
   - KHÔNG được thêm/bớt text
   - CHỈ có field `error`, KHÔNG có `error_description`

3. **Sử dụng TypeScript types được cung cấp**
   - Đảm bảo type safety
   - Tránh lỗi runtime

4. **Validate input trước khi gọi API**
   - `creatorphone`: Bắt buộc, regex `/^(0[3-9])[0-9]{8}$/`
   - `fromdate`, `todate`: Format YYYY-MM-DD nếu có
   - `page`: >= 1
   - `pagesize`: 1-200

5. **Xử lý TẤT CẢ error cases**
   - 400: Missing parameter hoặc invalid phone
   - 401: Invalid/expired token
   - 403: Insufficient permissions
   - 500: Internal error

6. **Đọc response headers**
   ```typescript
   const requestId = response.headers.get('X-Request-ID');
   const responseTime = response.headers.get('X-Response-Time');
   console.log('Request ID:', requestId);
   console.log('Response Time:', responseTime);
   ```

---

### ❌ KHÔNG ĐƯỢC LÀM

1. ❌ Tự ý thay đổi error message
2. ❌ Bỏ qua việc check `success` field
3. ❌ Assume response structure mà không check
4. ❌ Format lại data mà không cần thiết
5. ❌ Ignore pagination khi có nhiều records
6. ❌ Gọi API không có Authorization header

---

## 📊 Data Source

API này đọc từ view:
```sql
api.hoahong_cskh
```

**Columns:**
- `creator_phone`: Số điện thoại nhân viên
- `creator_name`: Tên nhân viên
- `date`: Ngày (YYYY-MM-DD)
- `total_revenue`: Tổng doanh thu
- `total_orders`: Số lượng đơn hàng
- `total_vouchers_issued`: Số voucher đã phát hành
- `customer_breakdown`: JSONB chứa breakdown khách mới/cũ
  ```json
  {
    "new": {
      "orders": 15,
      "revenue": 5200000
    },
    "old": {
      "orders": 27,
      "revenue": 7600000
    }
  }
  ```

**Query Logic:**
- Filter by `creator_phone` (exact match)
- Filter by date range: `date >= fromdate AND date <= todate`
- Order by `date DESC` (newest first)
- Pagination: `LIMIT pagesize OFFSET (page-1)*pagesize`

---

## 🔒 Security & Logging

### 1. OAuth Token Validation
- Table: `api.oauth_tokens`
- Checks: `revoked = false`, `expires_at_vn > NOW()`

### 2. RBAC Permission Check
- Tables: `api.oauth_client_roles`, `api.oauth_role_permissions`
- Logic: Exact match FIRST, then wildcard
- Required: `can_read = true` for resource `hoahong.hoahong_cskh`

### 3. API Usage Logging
- Table: `api.oauth_token_usage`
- Logged fields:
  - `token_id`
  - `client_id`
  - `ip_address`
  - `endpoint`: `"api.hoahong_cskh"`
  - `status_code`: 200, 400, 401, 403, or 500
  - `created_at_vn`: Vietnam timezone

### 4. Token Last Used Update
- Table: `api.oauth_tokens`
- Updates: `last_used_at`, `last_used_at_vn`

---

## 📝 CHECKLIST IMPLEMENTATION

- [ ] Sử dụng ĐÚNG endpoint URL (GET method)
- [ ] Gửi ĐÚNG header Authorization với Bearer token
- [ ] LUÔN truyền parameter `creatorphone`
- [ ] Validate phone format regex trước khi gửi
- [ ] Validate date format (YYYY-MM-DD) nếu có
- [ ] Validate pagination values (page >= 1, pagesize <= 200)
- [ ] Kiểm tra `success` field TRƯỚC KHI xử lý
- [ ] Hiển thị `error` NGUYÊN VĂN khi lỗi (không có `error_description`)
- [ ] Sử dụng TypeScript types được cung cấp
- [ ] Sử dụng type guards (`isSuccessResponse`, `isErrorResponse`)
- [ ] Xử lý TẤT CẢ error cases (400, 401, 403, 500)
- [ ] Xử lý trường hợp empty data (`pagination.total = 0`)
- [ ] Test với nhiều scenarios (xem danh sách test cases bên dưới)
- [ ] Log `X-Request-ID` và `X-Response-Time` để monitor performance
- [ ] Handle network errors và JSON parse errors
- [ ] Format số tiền với VND currency
- [ ] Tính toán tổng số trang: `Math.ceil(total / pagesize)`
- [ ] Hiển thị breakdown khách mới/cũ

---

## 🧪 TEST CASES CHO FRONTEND

### Test Case 1: Success - Có dữ liệu
**Input:**
```typescript
fetchCommissionData(validToken, '0912345678')
```

**Expected Output:**
```typescript
{
  success: true,
  creator_phone: '0912345678',
  period: { from: '2025-11-01', to: '2025-11-17' },
  summary: {
    total_revenue: > 0,
    total_orders: > 0,
    total_vouchers: >= 0,
    breakdown: {
      new_customers: { revenue: >= 0, orders: >= 0 },
      old_customers: { revenue: >= 0, orders: >= 0 }
    }
  },
  pagination: { page: 1, pagesize: 10, total: > 0 }
}
```

**Verify:**
- ✅ `success === true`
- ✅ `summary.total_revenue > 0`
- ✅ `summary.breakdown` tồn tại và có cả `new_customers` và `old_customers`
- ✅ `pagination.total > 0`
- ✅ Response headers có `X-Request-ID` và `X-Response-Time`

---

### Test Case 2: Success - Không có dữ liệu
**Input:**
```typescript
fetchCommissionData(validToken, '0999999999', {
  fromDate: '2020-01-01',
  toDate: '2020-01-01'
})
```

**Expected Output:**
```typescript
{
  success: true,
  creator_phone: '0999999999',
  period: { from: '2020-01-01', to: '2020-01-01' },
  summary: {
    total_revenue: 0,
    total_orders: 0,
    total_vouchers: 0,
    breakdown: {
      new_customers: { revenue: 0, orders: 0 },
      old_customers: { revenue: 0, orders: 0 }
    }
  },
  pagination: { page: 1, pagesize: 10, total: 0 }
}
```

**Verify:**
- ✅ VẪN là `success: true` (KHÔNG phải error!)
- ✅ Tất cả số liệu = 0
- ✅ UI hiển thị message "Không có dữ liệu"

---

### Test Case 3: Error 401 - Invalid Token
**Input:**
```typescript
fetchCommissionData('invalid_token_xyz', '0912345678')
```

**Expected Output:**
```typescript
{
  success: false,
  error: "Token is invalid, expired, or revoked"
}
```

**Verify:**
- ✅ `success === false`
- ✅ CHỈ có field `error` (KHÔNG có `error_description`)
- ✅ Status code = 401
- ✅ UI redirect to login hoặc refresh token

---

### Test Case 4: Error 403 - No Permission
**Input:**
```typescript
fetchCommissionData(tokenWithoutPermission, '0912345678')
```

**Expected Output:**
```typescript
{
  success: false,
  error: "No read access to hoahong.hoahong_cskh"
}
```

**Verify:**
- ✅ `success === false`
- ✅ Status code = 403
- ✅ UI hiển thị "Bạn không có quyền truy cập"

---

### Test Case 5: Error 400 - Missing Parameter
**Input:**
```typescript
// Gọi API không có creatorphone
fetch('...?page=1', { headers: { Authorization: ... } })
```

**Expected Output:**
```typescript
{
  success: false,
  error: "Missing required parameter: creatorphone"
}
```

**Verify:**
- ✅ `success === false`
- ✅ Status code = 400

---

### Test Case 6: Error 400 - Invalid Phone Format
**Input:**
```typescript
fetchCommissionData(validToken, '123456')  // Sai format
```

**Expected Output:**
```typescript
{
  success: false,
  error: "Invalid phone number format"
}
```

**Verify:**
- ✅ `success === false`
- ✅ Status code = 400
- ✅ UI hiển thị lỗi validation

---

### Test Case 7: Pagination - Page 2
**Input:**
```typescript
fetchCommissionData(validToken, '0912345678', {
  page: 2,
  pageSize: 20
})
```

**Expected Output:**
```typescript
{
  success: true,
  pagination: {
    page: 2,
    pagesize: 20,
    total: >= 21  // Phải có ít nhất 21 records để page 2 tồn tại
  }
}
```

**Verify:**
- ✅ `pagination.page === 2`
- ✅ `summary` vẫn tính trên TẤT CẢ records (không chỉ page 2)
- ✅ Calculate: `totalPages = Math.ceil(total / pagesize)`

---

### Test Case 8: Date Range Filter
**Input:**
```typescript
fetchCommissionData(validToken, '0912345678', {
  fromDate: '2025-01-01',
  toDate: '2025-01-31'
})
```

**Expected Output:**
```typescript
{
  success: true,
  period: {
    from: '2025-01-01',
    to: '2025-01-31'
  },
  summary: { ... }  // Chỉ tính trong tháng 1/2025
}
```

**Verify:**
- ✅ `period.from` và `period.to` khớp với input
- ✅ `summary` chỉ tính data trong range này

---

### Test Case 9: Max Pagesize
**Input:**
```typescript
fetchCommissionData(validToken, '0912345678', {
  pageSize: 300  // Vượt max (200)
})
```

**Expected Output:**
```typescript
{
  success: true,
  pagination: {
    pagesize: 200  // Bị cap lại ở 200
  }
}
```

**Verify:**
- ✅ `pagination.pagesize === 200` (không phải 300)

---

### Test Case 10: Network Error
**Input:**
```typescript
// Simulate network offline
fetchCommissionData(validToken, '0912345678')
```

**Expected:**
- ❌ Throw network error
- ✅ Catch block được trigger
- ✅ UI hiển thị "Lỗi kết nối mạng"

---

## 🎯 VALIDATION CHECKLIST

### Frontend PHẢI validate TRƯỚC khi gọi API:

**Phone Number:**
```typescript
const phoneRegex = /^(0[3-9])[0-9]{8}$/;
if (!phoneRegex.test(phone)) {
  throw new Error('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số');
}
```

**Date Format:**
```typescript
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (fromDate && !dateRegex.test(fromDate)) {
  throw new Error('fromDate phải có format YYYY-MM-DD');
}
```

**Date Range Logic:**
```typescript
if (fromDate && toDate && fromDate > toDate) {
  throw new Error('fromDate không được lớn hơn toDate');
}
```

**Pagination:**
```typescript
if (page < 1) {
  throw new Error('page phải >= 1');
}
if (pageSize < 1 || pageSize > 200) {
  throw new Error('pageSize phải trong khoảng 1-200');
}
```

---

## 🎯 MESSAGE CHO LOVABLE

```
API này có response format RẤT CỤ THỂ và KHÁC với các API khác:

SUCCESS response có:
{
  "success": true,
  "creator_phone": "...",
  "period": { from, to },
  "summary": {
    total_revenue,
    total_orders,
    total_vouchers,
    breakdown: {
      new_customers: { revenue, orders },
      old_customers: { revenue, orders }
    }
  },
  "pagination": { page, pagesize, total }
}

ERROR response có:
{
  "success": false,
  "error": "error message"
}

LƯU Ý QUAN TRỌNG:
1. Error response CHỈ CÓ field "error" - KHÔNG CÓ "error_description"
2. Response headers có X-Request-ID và X-Response-Time
3. PHẢI kiểm tra "success" field trước
4. Hiển thị "error" NGUYÊN VĂN khi lỗi
5. Parameter "creatorphone" là BẮT BUỘC, phải match regex
6. Default: fromdate = đầu tháng, todate = hôm nay, page = 1, pagesize = 10
7. Max pagesize = 200
8. Date format: YYYY-MM-DD
9. Summary có breakdown chi tiết khách mới/cũ

Nếu không follow đúng format này, API sẽ KHÔNG hoạt động.
```

---

## 📌 Version History

- **v1.0** - Initial release
- **v1.1** - Added customer breakdown (new/old)
- **v1.2** - Complete documentation with actual code review

---

## 🔍 Internal Implementation Notes

### File Structure:
```
hoahong-cskh/
├── index.ts       # Main handler (278 lines)
├── auth.ts        # Token validation & RBAC (71 lines)
├── database.ts    # Query logic (40 lines)
└── helpers.ts     # Utility functions (17 lines)
```

### Key Features:
- ✅ Modular architecture with separate concerns
- ✅ Comprehensive error handling with try-catch
- ✅ RBAC enforcement (exact match before wildcard)
- ✅ Vietnam timezone handling throughout
- ✅ API usage logging for all requests
- ✅ Token last used tracking
- ✅ Detailed console logging for debugging
- ✅ CORS headers support
- ✅ Request ID tracking
- ✅ Response time measurement

### Performance Considerations:
- Default pagesize: 10 (balance between performance and usability)
- Max pagesize: 200 (prevent excessive data transfer)
- Query optimization: Indexed by `creator_phone` and `date`
- Pagination with `count: 'exact'` for accurate total

---

**Documentation generated from actual source code review - 100% accurate** ✅
