/**
 * useVariantAvailability Hook
 *
 * Determines variant availability status.
 */

import { useMemo } from 'react';

import type { AvailabilityStatus, VariantInfo } from '../types.js';

export interface UseVariantAvailabilityOptions {
  /**
   * Variant information from Shopify
   */
  variant: VariantInfo | null;

  /**
   * Quantity threshold to consider "low stock"
   * @default 5
   */
  lowStockThreshold?: number;
}

export interface UseVariantAvailabilityReturn {
  /**
   * Availability status
   */
  status: AvailabilityStatus;

  /**
   * Whether the variant is available for purchase
   */
  isAvailable: boolean;

  /**
   * Whether the variant is out of stock
   */
  isOutOfStock: boolean;

  /**
   * Whether stock is low (near threshold)
   */
  isLowStock: boolean;

  /**
   * Whether the "Notify Me" button should be shown
   */
  showNotifyMe: boolean;

  /**
   * Available quantity (if known)
   */
  quantityAvailable: number | undefined;
}

/**
 * Hook for determining variant availability
 *
 * @example
 * ```tsx
 * const { showNotifyMe, isOutOfStock, isLowStock } = useVariantAvailability({
 *   variant: selectedVariant,
 * });
 *
 * if (showNotifyMe) {
 *   return <NotifyMeButton variant={selectedVariant} />;
 * }
 *
 * if (isLowStock) {
 *   return <p>Only a few left!</p>;
 * }
 * ```
 */
export function useVariantAvailability(
  options: UseVariantAvailabilityOptions,
): UseVariantAvailabilityReturn {
  const { variant, lowStockThreshold = 5 } = options;

  return useMemo(() => {
    if (!variant) {
      return {
        status: 'out_of_stock' as AvailabilityStatus,
        isAvailable: false,
        isOutOfStock: true,
        isLowStock: false,
        showNotifyMe: false,
        quantityAvailable: undefined,
      };
    }

    const { availableForSale, quantityAvailable } = variant;

    // Determine status
    let status: AvailabilityStatus = 'available';
    if (!availableForSale) {
      status = 'out_of_stock';
    } else if (quantityAvailable !== undefined && quantityAvailable === 0) {
      // Available for sale but no quantity could mean preorder or oversell allowed
      status = 'preorder';
    }

    const isAvailable = availableForSale;
    const isOutOfStock = !availableForSale;
    const isLowStock =
      availableForSale &&
      quantityAvailable !== undefined &&
      quantityAvailable > 0 &&
      quantityAvailable <= lowStockThreshold;

    // Show "Notify Me" when out of stock
    const showNotifyMe = isOutOfStock;

    return {
      status,
      isAvailable,
      isOutOfStock,
      isLowStock,
      showNotifyMe,
      quantityAvailable,
    };
  }, [variant, lowStockThreshold]);
}
