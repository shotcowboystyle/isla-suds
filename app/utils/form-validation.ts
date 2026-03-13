import {isValidEmail} from './validation';

/**
 * Extract string fields from FormData, replacing the repeated
 * `String(formData.get('x') || '')` pattern.
 */
export function extractFields(
  formData: FormData,
  ...names: string[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const name of names) {
    result[name] = String(formData.get(name) || '');
  }
  return result;
}

interface FieldRule {
  name: string;
  /** true for default "Name is required" message, or a custom string. */
  required?: boolean | string;
  /** Return an error string if invalid, null if valid. */
  validate?: (value: string) => string | null;
}

/**
 * Validate extracted form values against a set of rules.
 * Returns per-field errors and a convenience boolean.
 */
export function validateFields(
  values: Record<string, string>,
  rules: FieldRule[],
): {fieldErrors: Record<string, string>; hasErrors: boolean} {
  const fieldErrors: Record<string, string> = {};

  for (const rule of rules) {
    const value = values[rule.name] ?? '';
    if (rule.required && !value) {
      fieldErrors[rule.name] =
        typeof rule.required === 'string'
          ? rule.required
          : `${rule.name.charAt(0).toUpperCase() + rule.name.slice(1)} is required`;
    } else if (value && rule.validate) {
      const error = rule.validate(value);
      if (error) fieldErrors[rule.name] = error;
    }
  }

  return {fieldErrors, hasErrors: Object.keys(fieldErrors).length > 0};
}

/** Reusable email validator for use with validateFields. */
export const emailValidator = (value: string): string | null =>
  isValidEmail(value) ? null : 'Please enter a valid email address';
