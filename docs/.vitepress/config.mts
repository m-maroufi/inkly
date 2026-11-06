import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/inkly/",
  title: "Inkly API Docs",
  description: "مستندات رسمی و راهنمای جامع وب‌سرویس پلتفرم اینکلی",
  lang: "fa-IR",
  dir: "rtl",

  themeConfig: {
    logo: "🖋️",
    siteTitle: "Inkly API",

    nav: [
      { text: "راهنمای شروع", link: "/guide/getting-started" },
      { text: "اندپوینت‌ها", link: "/api/auth" },
      { text: "مخزن گیت‌هاب", link: "https://github.com/m-maroufi/inkly" },
    ],

    sidebar: [
      {
        text: "🚀 مفاهیم پایه",
        collapsed: false,
        items: [
          { text: "شروع سریع", link: "/guide/getting-started" },
          { text: "احراز هویت و توکن‌ها", link: "/guide/authentication" },
          { text: "فرمت و مدیریت خطاها", link: "/guide/errors" },
        ],
      },
      {
        text: "👤 کاربران و هویت",
        collapsed: false,
        items: [
          { text: "احراز هویت (Auth)", link: "/api/auth" },
          { text: "پروفایل و کاربران (Users)", link: "/api/users" },
          { text: "دنبال‌کردن نویسندگان (Follows)", link: "/api/follows" },
        ],
      },
      {
        text: "📝 محتوا و وبلاگ",
        collapsed: false,
        items: [
          { text: "دسته‌بندی‌ها (Categories)", link: "/api/categories" },
          { text: "پست‌ها و مقالات (Posts)", link: "/api/posts" },
          { text: "برچسب‌ها (Tags)", link: "/api/tags" },
          { text: "رسانه و آپلود (Media)", link: "/api/media" },
        ],
      },
      {
        text: "💬 تعاملات و شبکه‌های اجتماعی",
        collapsed: false,
        items: [
          { text: "دیدگاه‌ها (Comments)", link: "/api/comments" },
          { text: "پسندیدن (Likes)", link: "/api/likes" },
          { text: "نشان‌شده‌ها (Bookmarks)", link: "/api/bookmarks" },
          { text: "بازدید مقالات (Views)", link: "/api/views" },
        ],
      },
      {
        text: "🛡️ نظارت و ارتباطات",
        collapsed: false,
        items: [
          {
            text: "صندوق اعلان‌ها (Notifications)",
            link: "/api/notifications",
          },
          { text: "گزارش تخلفات (Reports)", link: "/api/reports" },
        ],
      },
    ],

    search: {
      provider: "local",
    },

    footer: {
      message: "توسعه داده شده با Express 5 و TypeScript",
      copyright: "© 2026 Inkly. تمامی حقوق محفوظ است.",
    },
  },
});
