/**
 * Validation utilities for @tempered/hydrogen-restock
 */

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Basic email regex - handles most common cases
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate Shopify variant GID
 */
export function isValidVariantId(variantId: string): boolean {
  if (!variantId || typeof variantId !== 'string') {
    return false;
  }

  // Shopify GID format: gid://shopify/ProductVariant/123456789
  const gidRegex = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

  // Also accept numeric IDs
  const numericRegex = /^\d+$/;

  return gidRegex.test(variantId) || numericRegex.test(variantId);
}

/**
 * Validate Shopify product GID
 */
export function isValidProductId(productId: string): boolean {
  if (!productId || typeof productId !== 'string') {
    return false;
  }

  // Shopify GID format: gid://shopify/Product/123456789
  const gidRegex = /^gid:\/\/shopify\/Product\/\d+$/;

  // Also accept numeric IDs
  const numericRegex = /^\d+$/;

  return gidRegex.test(productId) || numericRegex.test(productId);
}

/**
 * Extract numeric ID from Shopify GID
 */
export function extractNumericId(gid: string): string {
  if (!gid) return '';

  const match = gid.match(/\/(\d+)$/);
  return match?.[1] ?? gid;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 500); // Limit length
}
