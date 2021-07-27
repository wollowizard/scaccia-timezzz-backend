export const assertOrThrow = (test: boolean, message: string) => {
  if (!test) throw new Error(message);
}

export const checkNonEmptyString = (s: any) =>
  assertOrThrow(typeof s === "string" && !!s?.length, "Non valid string")

export const checkIntegerBetween = (n: any, min: number, max: number) =>
  assertOrThrow(Number.isInteger(n) && n >= min && n <= max, "Non valid integer")
