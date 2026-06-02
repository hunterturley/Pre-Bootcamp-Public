/**
 * Best-effort E.164 normalization. The backend does the authoritative
 * normalization (it knows the agent's locale); this keeps the Review screen
 * value tidy before send.
 */
export function normalizePhone(raw: string | undefined, defaultCountry = '1'): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (trimmed.startsWith('+')) {
    return '+' + trimmed.slice(1).replace(/[^\d]/g, '');
  }
  const digits = trimmed.replace(/[^\d]/g, '');
  if (digits.length === 0) return '';
  // US/Canada 10-digit -> prepend country code.
  if (digits.length === 10) return `+${defaultCountry}${digits}`;
  if (digits.length === 11 && digits.startsWith(defaultCountry)) return `+${digits}`;
  return `+${digits}`;
}

/** Initials for avatar chips, e.g. "Jane Doe" -> "JD". */
export function initials(firstName: string, lastName: string): string {
  const a = firstName.trim().charAt(0);
  const b = lastName.trim().charAt(0);
  return (a + b).toUpperCase() || '?';
}
