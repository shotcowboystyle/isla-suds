/**
 * Type-safety verification for Button component with CVA variants.
 * This file uses @ts-expect-error to prove TypeScript rejects invalid variants.
 * These assertions ensure our CVA configuration provides compile-time safety.
 */

import {Button} from './Button';

// ✅ Valid variants - these should compile without errors
export function ValidButtonExamples() {
  return (
    <>
      <Button variant="primary" size="sm">
        Primary Small
      </Button>
      <Button variant="secondary" size="md">
        Secondary Medium
      </Button>
      <Button variant="ghost" size="lg">
        Ghost Large
      </Button>
      <Button>Default (primary, md)</Button>
    </>
  );
}

// ❌ Invalid variants - TypeScript MUST reject these at compile time
export function InvalidButtonExamples() {
  return (
    <>
      {/* @ts-expect-error - 'invalid' is not a valid variant */}
      <Button variant="invalid">Invalid Variant</Button>

      {/* @ts-expect-error - 'extra-large' is not a valid size */}
      <Button size="extra-large">Invalid Size</Button>

      {/* @ts-expect-error - 'danger' is not a valid variant */}
      <Button variant="danger" size="md">
        Invalid Variant
      </Button>
    </>
  );
}
