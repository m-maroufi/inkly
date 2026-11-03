import { count, eq } from "drizzle-orm";
import { db } from "../../db";
import { post_views } from "../../db/schema/post_views";
import { handleDatabaseError } from "../../shared/errors/database-error";
import { RecordViewInput } from "./view.types";

export async function createPostView(data: RecordViewInput) {
  try {
    const [view] = await db
      .insert(post_views)
      .values({
        post_id: data.postId,
        ip_address: data.ipAddress ?? null,
        user_id: data.userId ?? null,
        user_agent: data.userAgent ?? null,
        created_at: new Date(),
      })
      .returning();
    return view;
  } catch (error) {
    handleDatabaseError(error);
  }
}
export async function countViewsByPostId(postId: string): Promise<number> {
  const [result] = await db
    .select({ total: count() })
    .from(post_views)
    .where(eq(post_views.post_id, postId));
  return result ? Number(result.total) : 0;
}
