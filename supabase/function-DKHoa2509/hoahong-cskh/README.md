# API Hoa Hồng CSKH - Documentation Package

## 📦 Files trong package này

### 1. `api-hoahong-cskh-FINAL-DOCUMENTATION.md` (FULL)
**📄 ~500 dòng - Chi tiết 100%**

**Dành cho:**
- Backend developers cần hiểu logic đầy đủ
- QA testers cần test cases chi tiết
- Technical writers
- Architects review API design

**Nội dung:**
- ✅ Full request/response examples với giải thích từng field
- ✅ TypeScript types đầy đủ với JSDoc comments
- ✅ Error handling patterns chi tiết
- ✅ 10+ test cases cụ thể
- ✅ Implementation best practices
- ✅ Frontend integration guide
- ✅ Security & logging details
- ✅ Internal implementation notes

**Khi nào đọc:**
- Lần đầu implement API
- Debug issues phức tạp
- Cần hiểu logic business
- Review code

---

### 2. `api-hoahong-cskh-QUICK-REFERENCE.md` (QUICK)
**📋 ~100 dòng - Tóm tắt nhanh**

**Dành cho:**
- Frontend developers đã quen với API
- Quick lookup khi code
- Code review checklist
- Daily development reference

**Nội dung:**
- ✅ Success/Error response examples
- ✅ Parameters table
- ✅ Common errors table
- ✅ Quick tips & gotchas
- ✅ Minimal TypeScript types

**Khi nào đọc:**
- Cần recall nhanh structure
- Đang code và cần check format
- Review PR
- Debug lỗi đơn giản

---

## 🎯 Workflow đề xuất

### Lần đầu implement:
1. **ĐỌC FULL:** `api-hoahong-cskh-FINAL-DOCUMENTATION.md`
2. **COPY TYPES:** Paste TypeScript types vào project
3. **COPY HELPER:** Paste `fetchCommissionData()` function
4. **TEST:** Chạy qua 10 test cases
5. **BOOKMARK:** Mở Quick Reference bên cạnh khi code

### Development hàng ngày:
1. **MỞ QUICK:** `api-hoahong-cskh-QUICK-REFERENCE.md`
2. **CHECK:** Parameters, response structure
3. **VERIFY:** Error messages
4. **REFERENCE:** Full doc nếu cần detail

### Debug issues:
1. **CHECK QUICK:** Common errors table
2. **IF NOT FOUND:** Mở Full doc
3. **CHECK:** Test cases tương tự
4. **VERIFY:** Response structure chính xác

---

## ⚡ Quick Start (5 phút)

### Step 1: Copy Types
Mở **FULL doc**, tìm section "TypeScript Types", copy tất cả vào `types/api.ts`

### Step 2: Copy Helper Function
Mở **FULL doc**, tìm section "Error Handling Pattern", copy function `fetchCommissionData()` vào `services/api.ts`

### Step 3: Test
```typescript
import { fetchCommissionData } from './services/api';

// Test basic call
const result = await fetchCommissionData(
  'your_token',
  '0912345678'
);

if (result.success) {
  console.log('✅ Success:', result.summary);
} else {
  console.error('❌ Error:', result.error);
}
```

### Step 4: Check Quick Reference
Mở **QUICK ref** để xem:
- Parameters cần truyền gì
- Response structure thế nào
- Các lỗi thường gặp

---

## 🔍 Tìm thông tin nhanh

### "Tôi cần biết response có gì?"
→ **QUICK Reference** - Section "SUCCESS RESPONSE"

### "Tôi gặp lỗi X, nghĩa là gì?"
→ **QUICK Reference** - Section "COMMON ERRORS"

### "Làm sao tính tổng số trang?"
→ **QUICK Reference** - Section "QUICK TIPS"

### "TypeScript types đầy đủ ở đâu?"
→ **FULL Documentation** - Section "TypeScript Types"

### "Cách handle empty data?"
→ **FULL Documentation** - Test Case 2

### "Logic RBAC hoạt động thế nào?"
→ **FULL Documentation** - Section "Security & Logging"

### "Tôi cần test cases để QA?"
→ **FULL Documentation** - Section "TEST CASES"

---

## 💡 Tips cho Frontend Developers

### 1. Print cheat sheet
In **QUICK Reference** ra giấy, dán bên màn hình. Bạn sẽ cần nó!

### 2. Bookmark sections
Browser bookmark:
- Quick Ref - Parameters
- Quick Ref - Common Errors
- Full Doc - TypeScript Types

### 3. Code snippets
VSCode: Tạo snippet từ `fetchCommissionData()` function

### 4. Team sharing
Share link QUICK Ref trong team chat để mọi người dễ access

### 5. Regular review
Mỗi sprint, scan qua QUICK Ref để nhớ lại gotchas

---

## 🚨 CRITICAL - PHẢI ĐỌC

**CẢ 2 files đều nhấn mạnh những điểm này:**

1. **Error response CHỈ có `error`, KHÔNG có `error_description`**
   ```json
   { "success": false, "error": "message" }
   ```

2. **Summary tính trên ALL rows, không chỉ current page**
   - Database query all → calculate sum → paginate
   - Nếu 100 rows nhưng pagesize=10, summary vẫn tính 100 rows

3. **Empty data VẪN là success**
   ```json
   { "success": true, "summary": { "total_revenue": 0, ... }, "pagination": { "total": 0 } }
   ```

4. **Phone validation BẮT BUỘC**
   - Regex: `/^(0[3-9])[0-9]{8}$/`
   - Frontend PHẢI validate trước khi gọi

5. **LUÔN check `success` field trước**
   ```typescript
   if (data.success) { ... } else { ... }
   ```

---

## 📞 Support

**Nếu có thắc mắc:**
1. ĐỌC QUICK Reference trước
2. SEARCH trong FULL Documentation
3. CHECK Test Cases trong FULL doc
4. Nếu vẫn không clear → hỏi team

**Khi report bug:**
- Include request ID (`X-Request-ID` header)
- Include response time (`X-Response-Time` header)
- Paste FULL response JSON
- Note which doc section you followed

---

## ✅ Checklist trước khi deploy

- [ ] Đã đọc FULL Documentation ít nhất 1 lần
- [ ] Đã copy TypeScript types vào project
- [ ] Đã implement helper function
- [ ] Đã test ít nhất 5 test cases
- [ ] Đã validate phone number trước khi gọi
- [ ] Đã handle empty data case
- [ ] Đã handle ALL error cases
- [ ] Đã check `success` field trong code
- [ ] Đã format VND currency
- [ ] Đã calculate total pages correctly
- [ ] Đã print Quick Reference để tham khảo

---

**Documentation verified against source code:** ✅  
**Last updated:** 2025-11-17  
**Version:** 1.2
