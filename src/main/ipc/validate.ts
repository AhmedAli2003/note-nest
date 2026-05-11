export function assertString(v: unknown, field: string): asserts v is string {
  if (typeof v !== "string") throw new Error(`${field} must be a string`)
}

export function assertNumber(v: unknown, field: string): asserts v is number {
  if (typeof v !== "number") throw new Error(`${field} must be a number`)
}

export function assertBoolean(v: unknown, field: string): asserts v is boolean {
  if (typeof v !== "boolean") throw new Error(`${field} must be a boolean`)
}

export function assertOneOf<T extends string>(
  v: unknown,
  values: readonly T[],
  field: string
): asserts v is T {
  if (!values.includes(v as T)) {
    throw new Error(`${field} must be one of ${values.join(", ")}`)
  }
}
