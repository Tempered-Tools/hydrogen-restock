/**
 * WaitlistModal
 *
 * Modal dialog for waitlist signup (for collection pages).
 */

import { useCallback, useEffect, useRef } from 'react';

import { useWaitlist } from '../hooks/useWaitlist.js';
import { useWaitlistCount } from '../hooks/useWaitlistCount.js';

import type { FormEvent, ReactNode } from 'react';
import type { JoinWaitlistResponse, VariantInfo } from '../types.js';

export interface WaitlistModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Close the modal
   */
  onClose: () => void;

  /**
   * Variant to notify about
   */
  variant: VariantInfo;

  /**
   * Modal title
   * @default "Get notified when back in stock"
   */
  title?: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Submit button text
   * @default "Notify Me"
   */
  submitText?: string;

  /**
   * Loading text
   * @default "Adding..."
   */
  loadingText?: string;

  /**
   * Placeholder for email input
   * @default "Enter your email"
   */
  placeholder?: string;

  /**
   * Show waitlist count
   * @default true
   */
  showCount?: boolean;

  /**
   * Custom class names
   */
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  /**
   * Callback on successful signup
   */
  onSuccess?: (response: JoinWaitlistResponse) => void;

  /**
   * Callback on error
   */
  onError?: (error: string) => void;

  /**
   * Render custom content
   */
  children?: ReactNode;
}

/**
 * Modal for waitlist signup.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const [selectedVariant, setSelectedVariant] = useState<VariantInfo | null>(null);
 *
 * // On product card
 * <button onClick={() => {
 *   setSelectedVariant(variant);
 *   setIsOpen(true);
 * }}>
 *   Notify Me
 * </button>
 *
 * // Modal
 * {selectedVariant && (
 *   <WaitlistModal
 *     isOpen={isOpen}
 *     onClose={() => setIsOpen(false)}
 *     variant={selectedVariant}
 *   />
 * )}
 * ```
 */
export function WaitlistModal({
  isOpen,
  onClose,
  variant,
  title = 'Get notified when back in stock',
  description,
  submitText = 'Notify Me',
  loadingText = 'Adding...',
  placeholder = 'Enter your email',
  showCount = true,
  className,
  overlayClassName: _overlayClassName,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  onSuccess,
  onError,
  children,
}: WaitlistModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    email,
    setEmail,
    join,
    isJoining,
    isJoined,
    error,
    successMessage,
    reset,
  } = useWaitlist({
    variant,
    onJoinSuccess: (response) => {
      onSuccess?.(response);
      // Auto-close after success delay
      setTimeout(() => {
        onClose();
        reset();
      }, 2000);
    },
    onJoinError: onError,
  });

  const { count } = useWaitlistCount({
    variantId: variant.id,
    autoFetch: showCount && isOpen,
  });

  // Handle open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      // Focus email input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  // Handle click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await join(email);
    },
    [join, email],
  );

  const defaultDescription =
    description ?? `We'll email you when ${variant.productTitle} is available again.`;

  return (
    <dialog
      ref={dialogRef}
      className={className}
      onClick={handleBackdropClick}
      aria-labelledby="waitlist-modal-title"
      aria-describedby="waitlist-modal-description"
    >
      <div className={contentClassName} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={headerClassName}>
          <h2 id="waitlist-modal-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className={bodyClassName}>
          {/* Product info */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {variant.image && (
              <img
                src={variant.image.url}
                alt={variant.image.altText ?? variant.productTitle}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
            <div>
              <p style={{ fontWeight: 'bold', margin: 0 }}>{variant.productTitle}</p>
              {variant.variantTitle && (
                <p style={{ color: '#666', margin: '0.25rem 0' }}>{variant.variantTitle}</p>
              )}
              {variant.price && (
                <p style={{ margin: '0.25rem 0' }}>
                  {variant.price.currencyCode} {variant.price.amount}
                </p>
              )}
            </div>
          </div>

          <p id="waitlist-modal-description">{defaultDescription}</p>

          {showCount && count > 0 && (
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              {count} {count === 1 ? 'person is' : 'people are'} waiting for this product
            </p>
          )}

          {children}

          {/* Success state */}
          {isJoined ? (
            <div role="status" aria-live="polite" style={{ color: 'green', padding: '1rem 0' }}>
              <p>{successMessage ?? "You're on the list! We'll email you when it's back."}</p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  required
                  disabled={isJoining}
                  aria-label="Email address"
                  aria-describedby={error ? 'waitlist-error' : undefined}
                  autoComplete="email"
                  style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button
                  type="submit"
                  disabled={isJoining}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isJoining ? 'not-allowed' : 'pointer',
                    opacity: isJoining ? 0.7 : 1,
                  }}
                >
                  {isJoining ? loadingText : submitText}
                </button>
              </div>

              {error && (
                <p
                  id="waitlist-error"
                  role="alert"
                  style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.875rem' }}
                >
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {footerClassName && (
          <div className={footerClassName}>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
