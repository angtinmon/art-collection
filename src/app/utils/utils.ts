import { notEmpty } from "@aposin/ng-aquila/utils";

export function isRealNumber(input: unknown): input is number {
  return typeof input === 'number' && isFinite(input);
}

export function isStringNotEmpty(input: unknown): input is string {
  return typeof input === 'string' && notEmpty(input);
}

export function validateNumber(input: unknown): number | null
export function validateNumber<T>(input: unknown, defaultValue: T): number | T
export function validateNumber(input: unknown, defaultValue: any = null): any {
  return isRealNumber(input) ? input : defaultValue;
}

export function validateString(input: unknown): string | null
export function validateString<T>(input: unknown, defaultValue: T): string | T
export function validateString(input: unknown, defaultValue: any = null): any {
  return isStringNotEmpty(input) ? input : defaultValue;
}



// check if data from API response is an array and copy it into a new array
export function validateArray<T>(array: T[]): T[] {
  return Array.isArray(array) ? Array.from(array) : [];
}

// join an array of strings but exclude empty/null/undefined
export function joinNotEmpty(array: (string | number)[], separator: string): string {
  return array.filter(item => isRealNumber(item) || isStringNotEmpty(item)).join(separator);
}