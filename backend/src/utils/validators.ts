/**
 * Basic validation helpers for API request bodies.
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateInquiryBody(body: Record<string, unknown>): string | null {
  if (!isNonEmptyString(body.name)) return "Name is required";
  if (!isNonEmptyString(body.email)) return "Email is required";
  if (!isValidEmail(body.email as string)) return "Invalid email format";
  if (!isNonEmptyString(body.phone)) return "Phone is required";
  if (!isNonEmptyString(body.message)) return "Message is required";
  return null;
}
