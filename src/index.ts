/**
 * @tempered/hydrogen-restock
 *
 * Back-in-stock notification components for Shopify Hydrogen storefronts.
 *
 * @example
 * ```tsx
 * import {
 *   RestockProvider,
 *   NotifyMeButton,
 *   WaitlistModal,
 *   WaitlistCount,
 *   useVariantAvailability,
 * } from '@tempered/hydrogen-restock';
 *
 * // In your root layout
 * export default function App() {
 *   return (
 *     <RestockProvider
 *       config={{
 *         apiUrl: 'https://restockbridge.temperedtools.xyz',
 *         shopDomain: 'my-store.myshopify.com',
 *       }}
 *     >
 *       <Outlet />
 *     </RestockProvider>
 *   );
 * }
 *
 * // On a product page
 * export default function ProductPage({ variant }) {
 *   const { showNotifyMe } = useVariantAvailability({ variant });
 *
 *   if (showNotifyMe) {
 *     return (
 *       <>
 *         <NotifyMeButton variant={variant} />
 *         <WaitlistCount variantId={variant.id} />
 *       </>
 *     );
 *   }
 *
 *   return <AddToCartButton variant={variant} />;
 * }
 * ```
 */

// Components
export { RestockProvider, useRestockConfig } from './components/RestockProvider.js';
export { NotifyMeButton } from './components/NotifyMeButton.js';
export { WaitlistModal } from './components/WaitlistModal.js';
export { WaitlistCount } from './components/WaitlistCount.js';
export { PreorderButton } from './components/PreorderButton.js';

// Hooks
export { useWaitlist } from './hooks/useWaitlist.js';
export { useWaitlistCount } from './hooks/useWaitlistCount.js';
export { useVariantAvailability } from './hooks/useVariantAvailability.js';

// Utils
export { isValidEmail, isValidVariantId, isValidProductId, extractNumericId, sanitizeInput } from './utils/validation.js';
export { DEFAULT_ERROR_MESSAGES, DEFAULT_SUCCESS_MESSAGES, API_ENDPOINTS, STORAGE_KEYS } from './utils/constants.js';

// Types
export type {
  WaitlistStatus,
  AvailabilityStatus,
  WaitlistEntry,
  VariantInfo,
  WaitlistCountResponse,
  JoinWaitlistRequest,
  JoinWaitlistResponse,
  LeaveWaitlistRequest,
  LeaveWaitlistResponse,
  RestockBridgeConfig,
  WaitlistState,
  ModalState,
  PreorderConfig,
  NotificationPreferences,
} from './types.js';

// Component props types
export type { RestockProviderProps } from './components/RestockProvider.js';
export type { NotifyMeButtonProps } from './components/NotifyMeButton.js';
export type { WaitlistModalProps } from './components/WaitlistModal.js';
export type { WaitlistCountProps } from './components/WaitlistCount.js';
export type { PreorderButtonProps } from './components/PreorderButton.js';

// Hook return types
export type { UseWaitlistOptions, UseWaitlistReturn } from './hooks/useWaitlist.js';
export type { UseWaitlistCountOptions, UseWaitlistCountReturn } from './hooks/useWaitlistCount.js';
export type { UseVariantAvailabilityOptions, UseVariantAvailabilityReturn } from './hooks/useVariantAvailability.js';
