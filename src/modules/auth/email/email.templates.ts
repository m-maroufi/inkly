export function buildEmailVerificationEmail(verificationUrl: string) {
  return {
    subject: "تأیید آدرس ایمیل در Inkly",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8;">
        <h1>به Inkly خوش آمدید 👋</h1>

        <p>
          از اینکه در Inkly ثبت‌نام کردید خوشحالیم.
        </p>

        <p>
          برای تکمیل ثبت‌نام و فعال‌سازی حساب کاربری،
          لطفاً آدرس ایمیل خود را تأیید کنید.
        </p>

        <p>
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            تأیید ایمیل
          </a>
        </p>

        <p>
          این لینک تأیید تا ۲۴ ساعت معتبر است.
        </p>

        <p>
          اگر شما این حساب کاربری را ایجاد نکرده‌اید،
          می‌توانید این ایمیل را نادیده بگیرید.
        </p>

        <p>
          با احترام،
          <br />
          تیم Inkly
        </p>
      </div>
    `,
  };
}

export function buildPasswordResetEmail(resetUrl: string) {
  return {
    subject: "بازنشانی رمز عبور در Inkly",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8;">
        <h1>بازنشانی رمز عبور 🔐</h1>

        <p>
          برای حساب کاربری شما درخواست بازنشانی رمز عبور ثبت شده است.
        </p>

        <p>
          برای انتخاب رمز عبور جدید روی دکمه زیر کلیک کنید:
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            بازنشانی رمز عبور
          </a>
        </p>

        <p>
          این لینک تا ۱۵ دقیقه معتبر است.
        </p>

        <p>
          اگر شما درخواست بازنشانی رمز عبور نداده‌اید،
          می‌توانید این ایمیل را نادیده بگیرید.
        </p>

        <p>
          با احترام،
          <br />
          تیم Inkly
        </p>
      </div>
    `,
  };
}
