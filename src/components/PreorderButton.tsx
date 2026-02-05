/**
 * PreorderButton
 *
 * Preorder button with delivery estimate.
 */

import type { ReactNode } from 'react';
import type { PreorderConfig, VariantInfo } from '../types.js';

export interface PreorderButtonProps {
  /**
   * Variant to preorder
   */
  variant: VariantInfo;

  /**
   * Preorder configuration
   */
  config?: PreorderConfig;

  /**
   * Button text
   * @default "Pre-order"
   */
  buttonText?: string;

  /**
   * Click handler (typically adds to cart)
   */
  onClick?: () => void;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Whether loading
   */
  loading?: boolean;

  /**
   * Loading text
   * @default "Adding..."
   */
  loadingText?: string;

  /**
   * Show estimated ship date
   * @default true
   */
  showEstimate?: boolean;

  /**
   * Custom class names
   */
  className?: string;
  buttonClassName?: string;
  estimateClassName?: string;

  /**
   * Render custom button
   */
  renderButton?: (props: {
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    text: string;
  }) => ReactNode;
}

/**
 * Preorder button with delivery estimate.
 *
 * @example
 * ```tsx
 * <PreorderButton
 *   variant={selectedVariant}
 *   config={{
 *     enabled: true,
 *     estimatedShipDate: '2024-03-15',
 *     message: 'Ships in 2-3 weeks',
 *   }}
 *   onClick={() => addToCart(variant.id)}
 * />
 * ```
 */
export function PreorderButton({
  variant,
  config,
  buttonText = 'Pre-order',
  onClick,
  disabled = false,
  loading = false,
  loadingText = 'Adding...',
  showEstimate = true,
  className,
  buttonClassName,
  estimateClassName,
  renderButton,
}: PreorderButtonProps) {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const displayText = loading ? loadingText : buttonText;
  const isDisabled = disabled || loading;

  // Format estimated ship date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      });
    } catch {
      return dateString;
    }
  };

  const estimatedDate = config?.estimatedShipDate ? formatDate(config.estimatedShipDate) : null;
  const customMessage = config?.message;

  // Deposit info
  const depositInfo =
    config?.requireDeposit && config?.depositAmount
      ? config.depositType === 'percentage'
        ? `${config.depositAmount}% deposit required`
        : `${variant.price?.currencyCode ?? '$'}${config.depositAmount} deposit required`
      : null;

  if (renderButton) {
    return (
      <div className={className}>
        {renderButton({ onClick: handleClick, disabled: isDisabled, loading, text: displayText })}
        {showEstimate && (estimatedDate || customMessage) && (
          <p className={estimateClassName} style={{ fontSize: '0.875rem', color: '#666' }}>
            {customMessage ?? `Estimated ship date: ${estimatedDate}`}
          </p>
        )}
        {depositInfo && (
          <p style={{ fontSize: '0.75rem', color: '#888' }}>{depositInfo}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={buttonClassName}
        aria-busy={loading}
        style={{
          padding: '0.75rem 1.5rem',
          background: isDisabled ? '#ccc' : '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: 500,
        }}
      >
        {displayText}
      </button>

      {showEstimate && (estimatedDate || customMessage) && (
        <p
          className={estimateClassName}
          style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}
        >
          {customMessage ?? `Estimated ship date: ${estimatedDate}`}
        </p>
      )}

      {depositInfo && (
        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>{depositInfo}</p>
      )}
    </div>
  );
}
