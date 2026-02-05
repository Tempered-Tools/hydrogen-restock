/**
 * useWaitlistCount Hook
 *
 * Fetches the current waitlist count for a variant.
 */

import { useCallback, useEffect, useState } from 'react';

import { useRestockConfig } from '../components/RestockProvider.js';
import { API_ENDPOINTS } from '../utils/constants.js';
import { extractNumericId } from '../utils/validation.js';

import type { WaitlistCountResponse } from '../types.js';

export interface UseWaitlistCountOptions {
  /**
   * Variant ID to get count for
   */
  variantId: string;

  /**
   * Whether to fetch immediately on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Cache duration in milliseconds
   * @default 60000 (1 minute)
   */
  cacheDuration?: number;
}

export interface UseWaitlistCountReturn {
  /**
   * Current waitlist count
   */
  count: number;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error message if fetch failed
   */
  error: string | undefined;

  /**
   * Manually refetch the count
   */
  refetch: () => Promise<void>;
}

// Simple in-memory cache
const countCache = new Map<string, { count: number; timestamp: number }>();

/**
 * Hook for fetching waitlist count
 *
 * @example
 * ```tsx
 * const { count, isLoading } = useWaitlistCount({
 *   variantId: variant.id,
 * });
 *
 * return count > 0 ? <span>{count} people waiting</span> : null;
 * ```
 */
export function useWaitlistCount(options: UseWaitlistCountOptions): UseWaitlistCountReturn {
  const { variantId, autoFetch = true, cacheDuration = 60000 } = options;
  const config = useRestockConfig();

  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const fetchCount = useCallback(async () => {
    const numericId = extractNumericId(variantId);
    const cacheKey = `${config.shopDomain}:${numericId}`;

    // Check cache
    const cached = countCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      setCount(cached.count);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const url = `${config.apiUrl}${API_ENDPOINTS.count}/${numericId}?shop=${encodeURIComponent(config.shopDomain)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
        },
      });

      if (!res.ok) {
        // Don't show error for 404 (no waitlist exists yet)
        if (res.status === 404) {
          setCount(0);
          countCache.set(cacheKey, { count: 0, timestamp: Date.now() });
          return;
        }
        throw new Error('Failed to fetch waitlist count');
      }

      const result: WaitlistCountResponse = await res.json();

      setCount(result.count);
      countCache.set(cacheKey, { count: result.count, timestamp: Date.now() });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch count';
      setError(errorMsg);
      // Still set count to 0 on error so component can render
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [config.apiUrl, config.apiKey, config.shopDomain, variantId, cacheDuration]);

  const refetch = useCallback(async () => {
    // Clear cache for this variant
    const numericId = extractNumericId(variantId);
    const cacheKey = `${config.shopDomain}:${numericId}`;
    countCache.delete(cacheKey);

    await fetchCount();
  }, [config.shopDomain, variantId, fetchCount]);

  useEffect(() => {
    if (autoFetch && variantId) {
      void fetchCount();
    }
  }, [autoFetch, variantId, fetchCount]);

  return {
    count,
    isLoading,
    error,
    refetch,
  };
}
