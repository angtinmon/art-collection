import { notEmpty } from "@aposin/ng-aquila/utils";

export function isRealNumber(input: unknown): input is number {
  return typeof input === 'number' && isFinite(input);
}

export function isStringNotEmpty(input: unknown): input is string {
  return typeof input === 'string' && notEmpty(input);
}

export function validateNumber(input: unknown): number | null {
  return validateValue(isRealNumber, input);
}

export function validateString(input: unknown): string | null {
  return validateValue(isStringNotEmpty, input);
}

// check if the value from API is valid according to its type and return it or else return null
export function validateValue<T>(validator: (input: unknown) => input is T, input: unknown): T | null {
  return validator(input) ? input : null;
}

// check if data from API response is an array and copy it into a new array or else return an empty array
export function validateArray<T>(array: T[]): T[] {
  return Array.isArray(array) ? Array.from(array) : [];
}

export function compareStringOrNumber<T extends string | number | null | undefined>(a: T, b: T): -1 | 1 | 0 {
  return (a ?? '') < (b ?? '') ? -1 : (a ?? '') > (b ?? '') ? 1 : 0;
}
