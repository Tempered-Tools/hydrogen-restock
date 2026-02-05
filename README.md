# @tempered/hydrogen-restock

Back-in-stock notification components for Shopify Hydrogen storefronts.

**Bundle size:** < 15KB gzipped

## Installation

```bash
npm install @tempered/hydrogen-restock
# or
pnpm add @tempered/hydrogen-restock
# or
yarn add @tempered/hydrogen-restock
```

## Quick Start

### 1. Set up the provider

Wrap your Hydrogen app with `RestockProvider`:

```tsx
// app/root.tsx
import { RestockProvider } from '@tempered/hydrogen-restock';

export default function App() {
  return (
    <RestockProvider
      config={{
        apiUrl: 'https://restockbridge.temperedtools.xyz',
        shopDomain: 'my-store.myshopify.com',
        apiKey: 'rb_...', // Optional: for authenticated requests
      }}
    >
      <Outlet />
    </RestockProvider>
  );
}
```

### 2. Add "Notify Me" buttons

Replace your "Add to Cart" button with a "Notify Me" button when products are out of stock:

```tsx
// app/components/ProductForm.tsx
import { NotifyMeButton, useVariantAvailability } from '@tempered/hydrogen-restock';

export function ProductForm({ variant }) {
  const { showNotifyMe, isLowStock } = useVariantAvailability({ variant });

  if (showNotifyMe) {
    return (
      <NotifyMeButton
        variant={{
          id: variant.id,
          productId: variant.product.id,
          productTitle: variant.product.title,
          variantTitle: variant.title,
          availableForSale: variant.availableForSale,
        }}
      />
    );
  }

  return (
    <>
      <AddToCartButton variant={variant} />
      {isLowStock && <p>Only a few left!</p>}
    </>
  );
}
```

### 3. Show social proof

Display how many customers are waiting:

```tsx
import { WaitlistCount } from '@tempered/hydrogen-restock';

export function ProductCard({ variant }) {
  return (
    <div>
      <WaitlistCount
        variantId={variant.id}
        formatText={(count) => `${count} customers want this!`}
      />
    </div>
  );
}
```

## Components

### RestockProvider

Context provider for RestockBridge configuration.

```tsx
<RestockProvider
  config={{
    apiUrl: string;      // RestockBridge API URL
    shopDomain: string;  // Your Shopify domain
    apiKey?: string;     // Optional API key
  }}
>
  {children}
</RestockProvider>
```

### NotifyMeButton

"Notify when available" button with inline email capture.

```tsx
<NotifyMeButton
  variant={variant}           // Required: variant info
  buttonText="Notify Me"      // Button text (collapsed)
  submitText="Notify Me"      // Submit button text
  loadingText="Adding..."     // Loading state text
  placeholder="Enter email"   // Input placeholder
  inline={false}              // Show form by default
  onSuccess={(response) => {}}
  onError={(error) => {}}
  className="..."
  buttonClassName="..."
  inputClassName="..."
/>
```

### WaitlistModal

Modal dialog for waitlist signup.

```tsx
<WaitlistModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  variant={variant}
  title="Get notified"
  showCount={true}            // Show waitlist count
  onSuccess={(response) => {}}
/>
```

### WaitlistCount

Social proof component.

```tsx
<WaitlistCount
  variantId={variant.id}
  minCount={1}                          // Min count to display
  formatText={(count) => `${count} waiting`}
/>
```

### PreorderButton

Preorder button with delivery estimate.

```tsx
<PreorderButton
  variant={variant}
  config={{
    enabled: true,
    estimatedShipDate: '2024-03-15',
    message: 'Ships in 2-3 weeks',
    requireDeposit: false,
  }}
  onClick={() => addToCart(variant.id)}
/>
```

## Hooks

### useWaitlist

Manage waitlist join/leave operations.

```tsx
const {
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
} = useWaitlist({
  variant,
  onJoinSuccess: (response) => {},
  onJoinError: (error) => {},
});
```

### useWaitlistCount

Fetch waitlist count with caching.

```tsx
const { count, isLoading, error, refetch } = useWaitlistCount({
  variantId: variant.id,
  autoFetch: true,
  cacheDuration: 60000, // 1 minute
});
```

### useVariantAvailability

Determine variant availability status.

```tsx
const {
  status,          // 'available' | 'out_of_stock' | 'preorder'
  isAvailable,
  isOutOfStock,
  isLowStock,
  showNotifyMe,
  quantityAvailable,
} = useVariantAvailability({
  variant,
  lowStockThreshold: 5,
});
```

## Styling

All components accept `className` props for custom styling. They ship with minimal inline styles that you can override.

For full control, use the render props:

```tsx
<NotifyMeButton
  variant={variant}
  renderButton={({ onClick, isExpanded }) => (
    <button onClick={onClick} className="my-custom-button">
      {isExpanded ? 'Enter email' : 'Notify Me'}
    </button>
  )}
  renderSuccess={({ message, onReset }) => (
    <div className="my-success-message">
      <p>{message}</p>
      <button onClick={onReset}>Done</button>
    </div>
  )}
/>
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  VariantInfo,
  RestockBridgeConfig,
  JoinWaitlistResponse,
  WaitlistStatus,
} from '@tempered/hydrogen-restock';
```

## Requirements

- React 18+ or React 19
- RestockBridge backend (Shopify app)

## License

MIT
