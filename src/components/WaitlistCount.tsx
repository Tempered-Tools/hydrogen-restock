/**
 * WaitlistCount
 *
 * Social proof component showing how many people are waiting.
 */

import { useWaitlistCount } from '../hooks/useWaitlistCount.js';

import type { ReactNode } from 'react';

export interface WaitlistCountProps {
  /**
   * Variant ID to show count for
   */
  variantId: string;

  /**
   * Minimum count to show (hides if below this)
   * @default 1
   */
  minCount?: number;

  /**
   * Format function for the count text
   * @default "{count} people waiting"
   */
  formatText?: (count: number) => string;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Render custom content
   */
  children?: (props: { count: number; isLoading: boolean }) => ReactNode;
}

/**
 * Display waitlist count for social proof.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <WaitlistCount variantId={variant.id} />
 *
 * // Custom format
 * <WaitlistCount
 *   variantId={variant.id}
 *   formatText={(count) => `${count} customers want this!`}
 * />
 *
 * // Custom render
 * <WaitlistCount variantId={variant.id}>
 *   {({ count }) => count > 10 && <span>High demand!</span>}
 * </WaitlistCount>
 * ```
 */
export function WaitlistCount({
  variantId,
  minCount = 1,
  formatText,
  className,
  children,
}: WaitlistCountProps) {
  const { count, isLoading } = useWaitlistCount({
    variantId,
    autoFetch: true,
  });

  // Custom render function
  if (children) {
    return <>{children({ count, isLoading })}</>;
  }

  // Hide if below minimum or loading
  if (isLoading || count < minCount) {
    return null;
  }

  const defaultFormat = (n: number) => `${n} ${n === 1 ? 'person' : 'people'} waiting`;
  const text = formatText ? formatText(count) : defaultFormat(count);

  return (
    <span className={className} aria-label={text}>
      {text}
    </span>
  );
}
