export class StringUtil {
  static slugify(value: string): string {
    return value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Spaces → hyphens
      .replace(/-+/g, "-") // Remove duplicate hyphens
      .replace(/^-|-$/g, ""); // Trim hyphens
  }
}
