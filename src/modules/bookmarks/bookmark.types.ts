import { bookmarks } from "../../db/schema/bookmarks";

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;

export type ToggleBookmarkResult = {
  bookmarked: boolean;
};

// اطلاعات کامل پست ذخیره‌شده برای نمایش در صفحه بوکمارک‌های من
export type BookmarkedPostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  bookmarkedAt: Date;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
};
