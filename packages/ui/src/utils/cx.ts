export type ClassValue = string | false | null | undefined;

/** Joins class names, ignoring `false`, `null`, `undefined` and empty strings. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
