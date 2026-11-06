# 🔐 احراز هویت و حساب کاربری (Auth)

ماژول احراز هویت وظیفه ثبت‌نام، ورود، تایید ایمیل، چرخش توکن‌های رفرش و مدیریت سشن‌ها را بر عهده دارد.  
پیشوند تمام روت‌های این ماژول: `/api/v1/auth`

---

## 📑 جدول خلاصه اندپوینت‌ها

| متد    | آدرس                     | دسترسی    | توضیحات                                   |
| ------ | ------------------------ | --------- | ----------------------------------------- |
| `POST` | `/email/register`        | عمومی     | ثبت‌نام اولیه و ارسال کد تایید به ایمیل   |
| `POST` | `/email/verify`          | عمومی     | فعال‌سازی حساب کاربری با کد تایید ارسالی  |
| `POST` | `/email/login`           | عمومی     | ورود با ایمیل و دریافت توکن دسترسی و کوکی |
| `POST` | `/refresh`               | رفرش‌توکن | تمدید توکن دسترسی منقضی‌شده با کوکی امن   |
| `POST` | `/logout`                | احراز شده | خروج از سیستم و باطل‌سازی سشن فعال        |
| `POST` | `/email/forgot-password` | عمومی     | ارسال ایمیل بازیابی رمز عبور              |
| `POST` | `/email/reset-password`  | عمومی     | تنظیم رمز عبور جدید با توکن یک‌بارمصرف    |
| `GET`  | `/me`                    | احراز شده | دریافت مشخصات حساب کاربری لاگین‌شده       |

---

## ۱. ثبت‌نام کاربر جدید (Register)

- **متد:** `POST`
- **آدرس:** `/api/v1/auth/email/register`

#### بدنه درخواست (JSON):

```json
{
  "email": "user@example.com",
  "username": "alirad",
  "displayName": "علی راد",
  "password": "StrongPassword123!"
}
```

#### نمونه پاسخ موفق (`201 Created`):

```json
{
  "success": true,
  "message": "Verification email sent. Please check your inbox.",
  "data": {
    "userId": "u1111111-1111-1111-1111-111111111111"
  }
}
```

---

## ۲. تایید حساب با ایمیل (Verify Email)

- **متد:** `POST`
- **آدرس:** `/api/v1/auth/email/verify`

#### بدنه درخواست (JSON):

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

#### نمونه پاسخ موفق (`200 OK`):

```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

---

## ۳. ورود به حساب کاربری (Login)

- **متد:** `POST`
- **آدرس:** `/api/v1/auth/email/login`

#### بدنه درخواست (JSON):

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

#### نمونه پاسخ موفق (`200 OK`):

> [!NOTE]
> توکن رفرش به صورت خودکار در کوکی `HttpOnly` با نام `refresh_token` ست می‌شود.

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "u1111111-1111-1111-1111-111111111111",
      "email": "user@example.com",
      "username": "alirad",
      "displayName": "علی راد",
      "role": "USER"
    }
  }
}
```

---

## ۴. دریافت پروفایل کاربر جاری (Get Me)

- **متد:** `GET`
- **آدرس:** `/api/v1/auth/me`
- **هدر:** `Authorization: Bearer <accessToken>`

#### نمونه پاسخ موفق (`200 OK`):

```json
{
  "success": true,
  "data": {
    "id": "u1111111-1111-1111-1111-111111111111",
    "email": "user@example.com",
    "username": "alirad",
    "displayName": "علی راد",
    "role": "USER",
    "avatarUrl": null
  }
}
```
