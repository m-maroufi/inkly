# 🤝 دنبال‌کردن نویسندگان (Follows)

سیستم ارتباط اجتماعی میان کاربران و نویسندگان برای پیگیری مقالات جدید.  
پیشوند تمام روت‌های این ماژول: `/api/v1/follows`

---

## 📑 جدول خلاصه اندپوینت‌ها

| متد    | آدرس                    | دسترسی    | توضیحات                                                             |
| ------ | ----------------------- | --------- | ------------------------------------------------------------------- |
| `POST` | `/:targetUserId`        | احراز شده | دنبال کردن (Follow) یا لغو دنبال کردن (Unfollow) به صورت دکمه سوییچ |
| `GET`  | `/:targetUserId/status` | احراز شده | استعلام اینکه آیا من این کاربر را دنبال کرده‌ام یا نه               |
| `GET`  | `/:userId/followers`    | عمومی     | دریافت لیست دنبال‌کنندگان یک کاربر                                  |
| `GET`  | `/:userId/following`    | عمومی     | دریافت لیست کسانی که این کاربر دنبال می‌کند                         |

---

## ۱. تغییر وضعیت دنبال کردن (Toggle Follow)

- **متد:** `POST`
- **آدرس:** `/api/v1/follows/:targetUserId`
- **هدر:** `Authorization: Bearer <accessToken>`

> [!WARNING]
> کاربر نمی‌تواند حساب کاربری خودش را دنبال کند (`409 Conflict`).

#### نمونه پاسخ موفق (هنگام فالو شدن):

```json
{
  "success": true,
  "data": {
    "followed": true,
    "message": "User followed successfully."
  }
}
```

#### نمونه پاسخ موفق (هنگام آن‌فالو شدن):

```json
{
  "success": true,
  "data": {
    "followed": false,
    "message": "User unfollowed successfully."
  }
}
```

---

## ۲. استعلام وضعیت دنبال کردن (Follow Status)

- **متد:** `GET`
- **آدرس:** `/api/v1/follows/:targetUserId/status`
- **هدر:** `Authorization: Bearer <accessToken>`

#### نمونه پاسخ موفق (`200 OK`):

```json
{
  "success": true,
  "data": {
    "isFollowing": true
  }
}
```
