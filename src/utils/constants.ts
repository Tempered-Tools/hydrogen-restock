/**
 * Constants for @tempered/hydrogen-restock
 */

/**
 * Default error messages
 */
export const DEFAULT_ERROR_MESSAGES = {
  invalidEmail: 'Please enter a valid email address.',
  alreadyJoined: 'You are already on the waitlist for this product.',
  notOnWaitlist: 'You are not on the waitlist for this product.',
  network: 'Network error. Please try again.',
  rateLimited: 'Too many requests. Please try again later.',
  unknown: 'An unexpected error occurred.',
};

/**
 * Default success messages
 */
export const DEFAULT_SUCCESS_MESSAGES = {
  joined: "You've been added to the waitlist. We'll email you when it's back in stock.",
  left: "You've been removed from the waitlist.",
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  waitlistEntries: 'restockbridge_waitlist_entries',
  emailCache: 'restockbridge_email_cache',
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  join: '/api/v1/join',
  leave: '/api/v1/leave',
  count: '/api/v1/count',
};

/**
 * Default request timeout in milliseconds
 */
export const REQUEST_TIMEOUT_MS = 10000;

/**
 * Minimum time before form can be submitted (anti-bot)
 */
export const MIN_SUBMISSION_TIME_MS = 1000;
