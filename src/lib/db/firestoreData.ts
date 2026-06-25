/** Firestore rejects `undefined` field values — strip them before every write. */
export function stripUndefinedForFirestore<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => stripUndefinedForFirestore(entry)) as T;
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) {
        result[key] = stripUndefinedForFirestore(entry);
      }
    }

    return result as T;
  }

  return value;
}
