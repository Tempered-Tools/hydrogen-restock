/**
 * @tempered/hydrogen-restock types
 */

/**
 * Waitlist entry status
 */
export type WaitlistStatus = 'waiting' | 'notified' | 'purchased' | 'unsubscribed';

/**
 * Variant availability status
 */
export type AvailabilityStatus = 'available' | 'out_of_stock' | 'preorder';

/**
 * Waitlist entry (returned from API)
 */
export interface WaitlistEntry {
  id: string;
  email: string;
  variantId: string;
  productId: string;
  status: WaitlistStatus;
  createdAt: string;
}

/**
 * Variant info for waitlist
 */
export interface VariantInfo {
  id: string;
  productId: string;
  productTitle: string;
  variantTitle: string | null;
  sku?: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  price?: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string;
  };
}

/**
 * Waitlist count response
 */
export interface WaitlistCountResponse {
  variantId: string;
  count: number;
}

/**
 * Join waitlist request
 */
export interface JoinWaitlistRequest {
  email: string;
  variantId: string;
  productId: string;
  productTitle?: string;
  variantTitle?: string;
}

/**
 * Join waitlist response
 */
export interface JoinWaitlistResponse {
  success: boolean;
  entryId?: string;
  message?: string;
  error?: string;
}

/**
 * Leave waitlist request
 */
export interface LeaveWaitlistRequest {
  email: string;
  variantId: string;
}

/**
 * Leave waitlist response
 */
export interface LeaveWaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * RestockBridge API client configuration
 */
export interface RestockBridgeConfig {
  /**
   * API base URL for the RestockBridge backend
   * @example "https://restockbridge.temperedtools.xyz"
   */
  apiUrl: string;

  /**
   * API key for authentication
   */
  apiKey?: string;

  /**
   * Shop domain
   * @example "my-store.myshopify.com"
   */
  shopDomain: string;
}

/**
 * Waitlist form state
 */
export interface WaitlistState {
  email: string;
  isJoining: boolean;
  isLeaving: boolean;
  isJoined: boolean;
  error?: string;
  successMessage?: string;
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  selectedVariant: VariantInfo | null;
}

/**
 * Preorder configuration
 */
export interface PreorderConfig {
  /**
   * Enable preorder functionality
   */
  enabled: boolean;

  /**
   * Expected shipping date (ISO string)
   */
  estimatedShipDate?: string;

  /**
   * Preorder message to display
   */
  message?: string;

  /**
   * Require deposit
   */
  requireDeposit?: boolean;

  /**
   * Deposit amount (percentage or fixed)
   */
  depositAmount?: number;

  /**
   * Deposit type
   */
  depositType?: 'percentage' | 'fixed';
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  /**
   * Receive email notifications
   */
  emailEnabled: boolean;

  /**
   * Receive SMS notifications (future)
   */
  smsEnabled?: boolean;
}

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  invalidEmail: 'Please enter a valid email address.',
  alreadyJoined: 'You are already on the waitlist for this product.',
  notOnWaitlist: 'You are not on the waitlist for this product.',
  network: 'Network error. Please try again.',
  rateLimited: 'Too many requests. Please try again later.',
  unknown: 'An unexpected error occurred.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  joined: 'You\'ve been added to the waitlist. We\'ll email you when it\'s back in stock.',
  left: 'You\'ve been removed from the waitlist.',
} as const;
