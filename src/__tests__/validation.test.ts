/**
 * hydrogen-restock validation utility tests
 */

import { describe, it, expect } from 'vitest';

import {
  isValidEmail,
  isValidVariantId,
  isValidProductId,
  extractNumericId,
  sanitizeInput,
} from '../utils/validation.js';

// ---------------------------------------------------------------------------
// isValidEmail
// ---------------------------------------------------------------------------

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user+tag@domain.co')).toBe(true);
    expect(isValidEmail('first.last@domain.org')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects missing TLD', () => {
    expect(isValidEmail('user@domain')).toBe(false);
  });

  it('rejects spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('trims whitespace before validation', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });

  it('rejects non-string input', () => {
    expect(isValidEmail(null as unknown as string)).toBe(false);
    expect(isValidEmail(undefined as unknown as string)).toBe(false);
    expect(isValidEmail(123 as unknown as string)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidVariantId
// ---------------------------------------------------------------------------

describe('isValidVariantId', () => {
  it('accepts Shopify GID format', () => {
    expect(isValidVariantId('gid://shopify/ProductVariant/123456789')).toBe(true);
  });

  it('accepts numeric ID', () => {
    expect(isValidVariantId('123456789')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidVariantId('')).toBe(false);
  });

  it('rejects wrong GID resource type', () => {
    expect(isValidVariantId('gid://shopify/Product/123456789')).toBe(false);
  });

  it('rejects non-numeric', () => {
    expect(isValidVariantId('abc')).toBe(false);
  });

  it('rejects null/undefined', () => {
    expect(isValidVariantId(null as unknown as string)).toBe(false);
    expect(isValidVariantId(undefined as unknown as string)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidProductId
// ---------------------------------------------------------------------------

describe('isValidProductId', () => {
  it('accepts Shopify GID format', () => {
    expect(isValidProductId('gid://shopify/Product/123456789')).toBe(true);
  });

  it('accepts numeric ID', () => {
    expect(isValidProductId('123456789')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidProductId('')).toBe(false);
  });

  it('rejects wrong GID resource type', () => {
    expect(isValidProductId('gid://shopify/ProductVariant/123456789')).toBe(false);
  });

  it('rejects non-numeric', () => {
    expect(isValidProductId('abc')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// extractNumericId
// ---------------------------------------------------------------------------

describe('extractNumericId', () => {
  it('extracts numeric ID from GID', () => {
    expect(extractNumericId('gid://shopify/Product/123456789')).toBe('123456789');
  });

  it('extracts from variant GID', () => {
    expect(extractNumericId('gid://shopify/ProductVariant/987654321')).toBe('987654321');
  });

  it('returns original if already numeric', () => {
    expect(extractNumericId('123456789')).toBe('123456789');
  });

  it('returns empty string for falsy input', () => {
    expect(extractNumericId('')).toBe('');
    expect(extractNumericId(null as unknown as string)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// sanitizeInput
// ---------------------------------------------------------------------------

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('removes angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
  });

  it('limits length to 500 characters', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long)).toHaveLength(500);
  });

  it('returns empty string for falsy input', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(null as unknown as string)).toBe('');
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(123 as unknown as string)).toBe('');
  });
});
