/**
 * NotifyMeButton
 *
 * "Notify when available" button with inline email capture.
 */

import { useCallback, useState } from 'react';

import { useWaitlist } from '../hooks/useWaitlist.js';

import type { FormEvent, ReactNode } from 'react';
import type { JoinWaitlistResponse, VariantInfo } from '../types.js';

export interface NotifyMeButtonProps {
  /**
   * Variant to notify about
   */
  variant: VariantInfo;

  /**
   * Button text when not expanded
   * @default "Notify Me"
   */
  buttonText?: string;

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
   * Success message
   */
  successMessage?: string;

  /**
   * Show inline form (expanded by default)
   * @default false
   */
  inline?: boolean;

  /**
   * Custom class names
   */
  className?: string;
  buttonClassName?: string;
  inputClassName?: string;
  formClassName?: string;
  errorClassName?: string;
  successClassName?: string;

  /**
   * Callback on successful signup
   */
  onSuccess?: (response: JoinWaitlistResponse) => void;

  /**
   * Callback on error
   */
  onError?: (error: string) => void;

  /**
   * Render custom button content
   */
  renderButton?: (props: { onClick: () => void; isExpanded: boolean }) => ReactNode;

  /**
   * Render custom success state
   */
  renderSuccess?: (props: { message: string; onReset: () => void }) => ReactNode;
}

/**
 * "Notify Me" button with email capture form.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <NotifyMeButton variant={selectedVariant} />
 *
 * // Inline form (always expanded)
 * <NotifyMeButton variant={selectedVariant} inline />
 *
 * // Custom styling
 * <NotifyMeButton
 *   variant={selectedVariant}
 *   className="my-notify-button"
 *   buttonClassName="btn btn-primary"
 *   inputClassName="form-input"
 * />
 * ```
 */
export function NotifyMeButton({
  variant,
  buttonText = 'Notify Me',
  submitText = 'Notify Me',
  loadingText = 'Adding...',
  placeholder = 'Enter your email',
  successMessage,
  inline = false,
  className,
  buttonClassName,
  inputClassName,
  formClassName,
  errorClassName,
  successClassName,
  onSuccess,
  onError,
  renderButton,
  renderSuccess,
}: NotifyMeButtonProps) {
  const [isExpanded, setIsExpanded] = useState(inline);

  const {
    email,
    setEmail,
    join,
    isJoining,
    isJoined,
    error,
    successMessage: defaultSuccess,
    reset,
  } = useWaitlist({
    variant,
    onJoinSuccess: onSuccess,
    onJoinError: onError,
  });

  const handleClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }, [isExpanded]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await join(email);
    },
    [join, email],
  );

  const handleReset = useCallback(() => {
    reset();
    if (!inline) {
      setIsExpanded(false);
    }
  }, [reset, inline]);

  // Show success state
  if (isJoined) {
    const message = successMessage ?? defaultSuccess ?? "We'll email you when it's back in stock.";

    if (renderSuccess) {
      return <>{renderSuccess({ message, onReset: handleReset })}</>;
    }

    return (
      <div className={successClassName ?? className} role="status" aria-live="polite">
        <p>{message}</p>
      </div>
    );
  }

  // Show button (collapsed state)
  if (!isExpanded) {
    if (renderButton) {
      return <>{renderButton({ onClick: handleClick, isExpanded })}</>;
    }

    return (
      <button
        type="button"
        onClick={handleClick}
        className={buttonClassName ?? className}
        aria-expanded="false"
        aria-controls="notify-me-form"
      >
        {buttonText}
      </button>
    );
  }

  // Show form (expanded state)
  return (
    <form
      id="notify-me-form"
      onSubmit={handleSubmit}
      className={formClassName ?? className}
      aria-label="Back in stock notification signup"
    >
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={isJoining}
          className={inputClassName}
          aria-label="Email address"
          aria-describedby={error ? 'notify-error' : undefined}
          autoComplete="email"
        />
        <button type="submit" disabled={isJoining} className={buttonClassName}>
          {isJoining ? loadingText : submitText}
        </button>
      </div>

      {error && (
        <p
          id="notify-error"
          className={errorClassName}
          role="alert"
          style={{ color: 'red', marginTop: '0.25rem', fontSize: '0.875rem' }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
