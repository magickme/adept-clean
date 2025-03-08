type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean };

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
} 