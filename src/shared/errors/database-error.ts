import { ConflictError } from "./conflict-error";

export function handleDatabaseError(error: unknown): never {
  if (typeof error === "object" && error !== null && "code" in error) {
    if (error.code === "23505") {
      throw new ConflictError("Resource already exists.");
    }

    if (error.code === "23503") {
      throw new ConflictError(
        "Resource cannot be deleted because it is still being used.",
      );
    }
  }

  throw error;
}
