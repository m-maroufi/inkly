# 🖼️ رسانه و فایل‌ها (Media)

کتابخانه مدیریت رسانه‌ها و آپلود فایل‌های ابری بر روی Cloudinary.  
پیشوند تمام روت‌های این ماژول: `/api/v1/media`

---

## 📑 جدول خلاصه اندپوینت‌ها

| متد      | آدرس        | دسترسی       | توضیحات                                           |
| -------- | ----------- | ------------ | ------------------------------------------------- |
| `POST`   | `/`         | احراز شده    | آپلود فایل جدید به Cloudinary و ذخیره متادیتا     |
| `GET`    | `/`         | احراز شده    | دریافت لیست کل فایل‌های کتابخانه رسانه کاربر جاری |
| `GET`    | `/:mediaId` | عمومی        | دریافت مشخصات یک رسانه با شناسه                   |
| `PATCH`  | `/:mediaId` | مالک / ادمین | ویرایش متن جایگزین (`altText`) فایل               |
| `DELETE` | `/:mediaId` | مالک / ادمین | حذف دائمی فایل از Cloudinary و دیتابیس            |

---

## ۱. آپلود رسانه جدید (Upload Media)

- **متد:** `POST`
- **آدرس:** `/api/v1/media`
- **نوع بدنه:** `multipart/form-data`
- **هدر:** `Authorization: Bearer <accessToken>`

#### فیلدهای فرم:

- `file`: فایل تصویر (فرمت‌های JPEG/PNG/WebP، حداکثر ۵ مگابایت)
- `altText`: متن جایگزین برای سئو (اختیاری)

#### نمونه پاسخ موفق (`201 Created`):

```json
{
  "success": true,
  "message": "Media uploaded successfully.",
  "data": {
    "id": "m1111111-1111-1111-1111-111111111111",
    "original_name": "architecture-diagram.png",
    "url": "http://res.cloudinary.com/.../architecture-diagram.png",
    "size": 185420,
    "alt_text": "دیاگرام معماری نرم‌افزار اینکلی"
  }
}
```

---

## ۲. حذف رسانه (Delete Media)

- **متد:** `DELETE`
- **آدرس:** `/api/v1/media/:mediaId`
- **هدر:** `Authorization: Bearer <accessToken>`

#### نمونه پاسخ موفق (`200 OK`):

```json
{
  "success": true,
  "message": "Media deleted successfully."
}
```
