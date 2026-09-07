export function generateSlug(text: string): string {
  return text
    .trim()
    .normalize("NFKC")
    .replace(/[\u200C\u200D]/g, " ")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
