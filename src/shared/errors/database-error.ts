import { ConflictError } from "./conflict-error";

export function handleDatabaseError(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  ) {
    throw new ConflictError("Resource already exists.");
  }

  throw error;
}
