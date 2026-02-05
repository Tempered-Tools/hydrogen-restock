/**
 * useWaitlist Hook
 *
 * Manages waitlist join/leave operations with the RestockBridge API.
 */

import { useCallback, useState } from 'react';

import { useRestockConfig } from '../components/RestockProvider.js';
import { API_ENDPOINTS, DEFAULT_ERROR_MESSAGES, DEFAULT_SUCCESS_MESSAGES } from '../utils/constants.js';
import { isValidEmail, sanitizeInput } from '../utils/validation.js';

import type {
  JoinWaitlistRequest,
  JoinWaitlistResponse,
  LeaveWaitlistResponse,
  VariantInfo,
  WaitlistState,
} from '../types.js';

export interface UseWaitlistOptions {
  /**
   * Variant information
   */
  variant: VariantInfo;

  /**
   * Callback on successful join
   */
  onJoinSuccess?: (response: JoinWaitlistResponse) => void;

  /**
   * Callback on join error
   */
  onJoinError?: (error: string) => void;

  /**
   * Callback on successful leave
   */
  onLeaveSuccess?: (response: LeaveWaitlistResponse) => void;

  /**
   * Callback on leave error
   */
  onLeaveError?: (error: string) => void;
}

export interface UseWaitlistReturn extends WaitlistState {
  /**
   * Join the waitlist
   */
  join: (email: string) => Promise<JoinWaitlistResponse>;

  /**
   * Leave the waitlist
   */
  leave: (email: string) => Promise<LeaveWaitlistResponse>;

  /**
   * Update email input value
   */
  setEmail: (email: string) => void;

  /**
   * Reset state
   */
  reset: () => void;
}

/**
 * Hook for managing waitlist join/leave operations
 *
 * @example
 * ```tsx
 * const {
 *   email,
 *   setEmail,
 *   join,
 *   isJoining,
 *   isJoined,
 *   error,
 * } = useWaitlist({
 *   variant: selectedVariant,
 *   onJoinSuccess: () => console.log('Joined!'),
 * });
 *
 * return (
 *   <form onSubmit={(e) => { e.preventDefault(); join(email); }}>
 *     <input value={email} onChange={(e) => setEmail(e.target.value)} />
 *     <button disabled={isJoining}>{isJoining ? 'Joining...' : 'Notify Me'}</button>
 *     {error && <p>{error}</p>}
 *   </form>
 * );
 * ```
 */
export function useWaitlist(options: UseWaitlistOptions): UseWaitlistReturn {
  const { variant, onJoinSuccess, onJoinError, onLeaveSuccess, onLeaveError } = options;
  const config = useRestockConfig();

  const [email, setEmail] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const join = useCallback(
    async (emailInput: string): Promise<JoinWaitlistResponse> => {
      const cleanEmail = sanitizeInput(emailInput).toLowerCase();

      // Validate email
      if (!isValidEmail(cleanEmail)) {
        const errorMsg = DEFAULT_ERROR_MESSAGES.invalidEmail;
        setError(errorMsg);
        onJoinError?.(errorMsg);
        return { success: false, error: errorMsg };
      }

      setIsJoining(true);
      setError(undefined);
      setSuccessMessage(undefined);

      try {
        const request: JoinWaitlistRequest = {
          email: cleanEmail,
          variantId: variant.id,
          productId: variant.productId,
          productTitle: variant.productTitle,
          variantTitle: variant.variantTitle ?? undefined,
        };

        const url = `${config.apiUrl}${API_ENDPOINTS.join}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
          },
          body: JSON.stringify({
            ...request,
            shop: config.shopDomain,
          }),
        });

        if (res.status === 429) {
          const errorMsg = DEFAULT_ERROR_MESSAGES.rateLimited;
          setError(errorMsg);
          onJoinError?.(errorMsg);
          return { success: false, error: errorMsg };
        }

        const result: JoinWaitlistResponse = await res.json();

        if (!res.ok || !result.success) {
          const errorMsg = result.error ?? DEFAULT_ERROR_MESSAGES.unknown;
          setError(errorMsg);
          onJoinError?.(errorMsg);
          return result;
        }

        setIsJoined(true);
        setSuccessMessage(result.message ?? DEFAULT_SUCCESS_MESSAGES.joined);
        onJoinSuccess?.(result);
        return result;
      } catch {
        const errorMsg = DEFAULT_ERROR_MESSAGES.network;
        setError(errorMsg);
        onJoinError?.(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsJoining(false);
      }
    },
    [config.apiUrl, config.apiKey, config.shopDomain, variant, onJoinSuccess, onJoinError],
  );

  const leave = useCallback(
    async (emailInput: string): Promise<LeaveWaitlistResponse> => {
      const cleanEmail = sanitizeInput(emailInput).toLowerCase();

      if (!isValidEmail(cleanEmail)) {
        const errorMsg = DEFAULT_ERROR_MESSAGES.invalidEmail;
        setError(errorMsg);
        onLeaveError?.(errorMsg);
        return { success: false, error: errorMsg };
      }

      setIsLeaving(true);
      setError(undefined);
      setSuccessMessage(undefined);

      try {
        const url = `${config.apiUrl}${API_ENDPOINTS.leave}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
          },
          body: JSON.stringify({
            email: cleanEmail,
            variantId: variant.id,
            shop: config.shopDomain,
          }),
        });

        if (res.status === 429) {
          const errorMsg = DEFAULT_ERROR_MESSAGES.rateLimited;
          setError(errorMsg);
          onLeaveError?.(errorMsg);
          return { success: false, error: errorMsg };
        }

        const result: LeaveWaitlistResponse = await res.json();

        if (!res.ok || !result.success) {
          const errorMsg = result.error ?? DEFAULT_ERROR_MESSAGES.unknown;
          setError(errorMsg);
          onLeaveError?.(errorMsg);
          return result;
        }

        setIsJoined(false);
        setSuccessMessage(result.message ?? DEFAULT_SUCCESS_MESSAGES.left);
        onLeaveSuccess?.(result);
        return result;
      } catch {
        const errorMsg = DEFAULT_ERROR_MESSAGES.network;
        setError(errorMsg);
        onLeaveError?.(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLeaving(false);
      }
    },
    [config.apiUrl, config.apiKey, config.shopDomain, variant, onLeaveSuccess, onLeaveError],
  );

  const reset = useCallback(() => {
    setEmail('');
    setIsJoining(false);
    setIsLeaving(false);
    setIsJoined(false);
    setError(undefined);
    setSuccessMessage(undefined);
  }, []);

  return {
    email,
    setEmail,
    join,
    leave,
    isJoining,
    isLeaving,
    isJoined,
    error,
    successMessage,
    reset,
  };
}
