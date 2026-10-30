import { z } from "zod";
import { users } from "../../db/schema/users";
import { updateProfileSchema } from "./user.schema";

export type User = typeof users.$inferSelect;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// دیتایی که ریپازیتوری برای آپدیت دیتابیس نیاز داره (شامل آدرس عکس جدید در صورت آپلود)
export type UpdateUserProfileRepositoryInput = UpdateProfileInput & {
  avatarUrl?: string | undefined;
};

// اطلاعات عمومی پروفایل یک کاربر به همراه آمار
export type PublicUserProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  createdAt: Date;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
};
