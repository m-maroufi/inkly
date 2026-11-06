# ❤️ پسندیدن مقالات (Likes)

سیستم لایک و آن‌لایک مقالات و مشاهده فهرست لایک‌کنندگان.  
پیشوند تمام روت‌های این ماژول: `/api/v1/likes`

---

## 📑 جدول خلاصه اندپوینت‌ها

| متد    | آدرس              | دسترسی    | توضیحات                                                      |
| ------ | ----------------- | --------- | ------------------------------------------------------------ |
| `POST` | `/:postId`        | احراز شده | تغییر وضعیت لایک مقاله (لایک در صورت عدم لایک، یا آن‌لایک)   |
| `GET`  | `/:postId/status` | احراز شده | بررسی اینکه آیا کاربر جاری این مقاله را لایک کرده است یا خیر |
| `GET`  | `/:postId/users`  | عمومی     | دریافت لیست کاربرانی که این مقاله را پسندیده‌اند             |

---

## ۱. تغییر وضعیت لایک (Toggle Like)

- **متد:** `POST`
- **آدرس:** `/api/v1/likes/:postId`
- **هدر:** `Authorization: Bearer <accessToken>`

#### نمونه پاسخ موفق (هنگام لایک شدن):

```json
{
  "success": true,
  "data": {
    "liked": true,
    "message": "Post liked successfully."
  }
}
```

#### نمونه پاسخ موفق (هنگام برداشته شدن لایک):

```json
{
  "success": true,
  "data": {
    "liked": false,
    "message": "Post unliked successfully."
  }
}
```

---

## ۲. استعلام وضعیت لایک (Like Status)

- **متد:** `GET`
- **آدرس:** `/api/v1/likes/:postId/status`
- **هدر:** `Authorization: Bearer <accessToken>`

#### نمونه پاسخ موفق (`200 OK`):

```json
{
  "success": true,
  "data": {
    "liked": true
  }
}
```
