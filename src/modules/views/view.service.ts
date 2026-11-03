import { AppError } from "../../shared/errors/app-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { hasRedisKey, setRedisValue } from "../../lib/redis/redis.store";
import { findPostById } from "../posts/post.repository";
import { countViewsByPostId, createPostView } from "./view.repository";
import { RecordViewInput, RecordViewResult } from "./view.types";
export async function recordPostViewService(
  data: RecordViewInput,
): Promise<RecordViewResult> {
  // ۱. بررسی وجود و وضعیت انتشار مقاله
  const post = await findPostById(data.postId);
  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }

  // ۲. ساخت کلیدهای ریدیس برای کاربر و آی‌پی
  const userKey = data.userId
    ? `view:${data.postId}:user:${data.userId}`
    : null;
  const ipKey = data.ipAddress
    ? `view:${data.postId}:ip:${data.ipAddress}`
    : null;

  // ۳. بررسی تکراری نبودن (اگر این کاربر یا این آی‌پی اخیراً بازدید زده باشند، ثبت نکن)
  try {
    const isUserViewed = userKey ? await hasRedisKey(userKey) : false;
    const isIpViewed = ipKey ? await hasRedisKey(ipKey) : false;

    if (isUserViewed || isIpViewed) {
      const totalViews = await countViewsByPostId(data.postId);
      return {
        recorded: false,
        totalViews,
      };
    }
  } catch {
    // چشم‌پوشی از خطای احتمالی ریدیس
  }

  // ۴. ثبت بازدید در دیتابیس
  const view = await createPostView(data);
  if (!view) {
    throw new AppError("Failed to record post view.", 500);
  }

  // ۵. ذخیره هر دو کلید در ریدیس برای ۱ ساعت
  try {
    if (userKey) await setRedisValue(userKey, "1", 3600);
    if (ipKey) await setRedisValue(ipKey, "1", 3600);
  } catch {
    // چشم‌پوشی از خطای احتمالی ریدیس
  }

  // ۶. بازگرداندن تعداد کل بازدیدها
  const totalViews = await countViewsByPostId(data.postId);
  return {
    recorded: true,
    totalViews,
  };
}

export async function getPostViewsCountService(
  postId: string,
): Promise<{ totalViews: number }> {
  const post = await findPostById(postId);
  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }

  const totalViews = await countViewsByPostId(postId);
  return { totalViews };
}
