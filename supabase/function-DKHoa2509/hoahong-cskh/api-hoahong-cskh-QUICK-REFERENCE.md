# API Hoa Hồng CSKH - QUICK REFERENCE

## 🚀 TL;DR (Too Long; Didn't Read)

```typescript
// 1. Call API
const response = await fetch(
  `https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh?creatorphone=0912345678`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);

const data = await response.json();

// 2. Check success
if (data.success) {
  // ✅ Success - Có summary và pagination
  console.log('Doanh thu:', data.summary.total_revenue);
  console.log('Khách mới:', data.summary.breakdown.new_customers);
  console.log('Khách cũ:', data.summary.breakdown.old_customers);
} else {
  // ❌ Error - CHỈ có data.error
  console.error(data.error);
}
```

---

## ✅ SUCCESS RESPONSE

```json
{
  "success": true,
  "creator_phone": "0912345678",
  "period": { "from": "2025-01-01", "to": "2025-01-31" },
  "summary": {
    "total_revenue": 8800000,
    "total_orders": 27,
    "total_vouchers": 55,
    "breakdown": {
      "new_customers": { "revenue": 4000000, "orders": 12 },
      "old_customers": { "revenue": 4800000, "orders": 15 }
    }
  },
  "pagination": { "page": 1, "pagesize": 10, "total": 2 }
}
```

**Key Points:**
- `summary` = SUM of ALL rows matching filter (không chỉ current page!)
- `pagination.total` = tổng số records trong DB
- Empty data vẫn return `success: true` với tất cả = 0

---

## ❌ ERROR RESPONSE

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Key Points:**
- CHỈ có 2 fields: `success` và `error`
- KHÔNG có `error_description`
- Hiển thị `error` NGUYÊN VĂN

---

## 📋 PARAMETERS

| Param | Required | Default | Format | Example |
|-------|----------|---------|--------|---------|
| `creatorphone` | ✅ YES | - | `/^(0[3-9])[0-9]{8}$/` | `0912345678` |
| `fromdate` | ❌ No | First day of month | YYYY-MM-DD | `2025-01-01` |
| `todate` | ❌ No | Today | YYYY-MM-DD | `2025-01-31` |
| `page` | ❌ No | 1 | >= 1 | `1` |
| `pagesize` | ❌ No | 10 | 1-200 | `50` |

---

## 🚨 COMMON ERRORS

| Status | Error Message | Meaning |
|--------|--------------|---------|
| 401 | `Missing or invalid Authorization header` | No token |
| 401 | `Token is invalid, expired, or revoked` | Bad token |
| 403 | `No read access to hoahong.hoahong_cskh` | No permission |
| 400 | `Missing required parameter: creatorphone` | No phone |
| 400 | `Invalid phone number format` | Wrong phone format |

---

## 💡 QUICK TIPS

### ✅ PHẢI LÀM:
1. LUÔN check `data.success` trước
2. Validate phone regex trước khi gọi: `/^(0[3-9])[0-9]{8}$/`
3. Format VND: `amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })`
4. Tổng trang: `Math.ceil(pagination.total / pagination.pagesize)`
5. Xử lý empty data: Check `pagination.total === 0`

### ❌ KHÔNG ĐƯỢC:
1. Assume structure mà không check `success`
2. Tìm field `error_description` (không tồn tại!)
3. Nghĩ `summary` chỉ tính current page (sai - tính ALL rows!)
4. Gửi phone sai format (phải validate)
5. Expect error khi empty data (vẫn success!)

---

## 📊 RESPONSE STRUCTURE (Minimal)

```typescript
type APIResponse = 
  | { success: true; creator_phone: string; period: Period; summary: Summary; pagination: Pagination }
  | { success: false; error: string };
```

---

## 🔗 Links

- Full Documentation: `api-hoahong-cskh-FINAL-DOCUMENTATION.md`
- Endpoint: `https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh`

---

**Last Updated:** 2025-11-17  
**Version:** 1.2  
**Verified Against:** Source code (index.ts, auth.ts, database.ts, helpers.ts)
