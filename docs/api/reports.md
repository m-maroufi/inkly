# 🛡️ گزارش تخلفات و مدیریت (Reports)

سیستم گزارش‌دهی تخلفات محتوایی (اسپم، آزار و اذیت، نقض کپی‌رایت و...) به همراه پنل مدیریت ویژه مدیران (`ADMIN`).  
پیشوند تمام روت‌های این ماژول: `/api/v1/reports`

---

## 📑 جدول خلاصه اندپوینت‌ها

| متد     | آدرس               | دسترسی    | توضیحات                                          |
| ------- | ------------------ | --------- | ------------------------------------------------ |
| `POST`  | `/`                | احراز شده | ثبت گزارش تخلف روی یک پست، کامنت، یا کاربر       |
| `GET`   | `/admin`           | فقط ادمین | مشاهده لیست تمامی گزارش‌ها با قابلیت فیلتر وضعیت |
| `GET`   | `/admin/:reportId` | فقط ادمین | مشاهده جزئیات کامل یک گزارش و هدف آن             |
| `PATCH` | `/admin/:reportId` | فقط ادمین | تغییر وضعیت رسیدگی به گزارش                      |

---

## ⚖️ دلایل مجاز گزارش (`reason`)

`SPAM` (اسپم) | `HARASSMENT` (آزار) | `HATE_SPEECH` (نفرت‌پراکنی) | `MISINFORMATION` (اطلاعات گمراه‌کننده) | `COPYRIGHT` (کپی‌رایت) | `INAPPROPRIATE_CONTENT` (محتوای نامناسب) | `OTHER` (سایر)

---

## ۱. ثبت گزارش جدید (Create Report)

- **متد:** `POST`
- **آدرس:** `/api/v1/reports`
- **هدر:** `Authorization: Bearer <accessToken>`

> [!IMPORTANT]
> در هر درخواست باید **دقیقاً یکی** از فیلدهای `postId` یا `commentId` یا `reportedUserId` ارسال شود. کاربر نمی‌تواند پروفایل خودش را گزارش کند (`409 Conflict`).

#### بدنه درخواست نمونه (گزارش پست):

```json
{
  "postId": "p1111111-1111-1111-1111-111111111111",
  "reason": "SPAM",
  "description": "این پست حاوی لینک‌های تبلیغاتی تکراری است."
}
```

#### نمونه پاسخ موفق (`201 Created`):

```json
{
  "success": true,
  "message": "Report submitted successfully.",
  "data": {
    "id": "r1111111-1111-1111-1111-111111111111",
    "reporter_id": "u1111111-1111-1111-1111-111111111111",
    "post_id": "p1111111-1111-1111-1111-111111111111",
    "reason": "SPAM",
    "status": "PENDING"
  }
}
```

---

## ۲. دریافت لیست گزارش‌ها برای مدیر (Get Reports - Admin)

- **متد:** `GET`
- **آدرس:** `/api/v1/reports/admin`
- **کوئری اختیاری:** `?status=PENDING`
- **هدر:** `Authorization: Bearer <accessToken>` (نقش `ADMIN`)

#### نمونه پاسخ موفق (`200 OK`):

```json
{
  "success": true,
  "data": [
    {
      "id": "r1111111-1111-1111-1111-111111111111",
      "reason": "SPAM",
      "status": "PENDING",
      "reporter": {
        "id": "u1111111-1111-1111-1111-111111111111",
        "username": "alirad",
        "displayName": "علی راد"
      },
      "post": {
        "id": "p1111111-1111-1111-1111-111111111111",
        "title": "پست تبلیغاتی",
        "slug": "spam-post"
      },
      "comment": null,
      "reportedUser": null
    }
  ]
}
```

---

## ۳. تغییر وضعیت رسیدگی به گزارش (Update Report Status)

- **متد:** `PATCH`
- **آدرس:** `/api/v1/reports/admin/:reportId`
- **هدر:** `Authorization: Bearer <accessToken>` (نقش `ADMIN`)

#### بدنه درخواست:

```json
{
  "status": "ACTION_TAKEN"
}
```

_(مقادیر مجاز برای وضعیت: `PENDING`, `REVIEWED`, `DISMISSED`, `ACTION_TAKEN`)_

#### نمونه پاسخ موفق (`200 OK`):

```json
{
  "success": true,
  "message": "Report status updated successfully.",
  "data": {
    "id": "r1111111-1111-1111-1111-111111111111",
    "status": "ACTION_TAKEN"
  }
}
```
