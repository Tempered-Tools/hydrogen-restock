/**
 * RestockProvider
 *
 * Context provider for RestockBridge configuration.
 * Wrap your Hydrogen app with this provider to enable back-in-stock notifications.
 */

import { createContext, useContext, useMemo } from 'react';

import type { RestockBridgeConfig } from '../types.js';
import type { ReactNode } from 'react';

interface RestockContextValue {
  config: RestockBridgeConfig;
}

const RestockContext = createContext<RestockContextValue | null>(null);

export interface RestockProviderProps {
  /**
   * RestockBridge configuration
   */
  config: RestockBridgeConfig;

  /**
   * Child components
   */
  children: ReactNode;
}

/**
 * Provider component for RestockBridge context.
 *
 * @example
 * ```tsx
 * import { RestockProvider } from '@tempered/hydrogen-restock';
 *
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
 * ```
 */
export function RestockProvider({ config, children }: RestockProviderProps) {
  const value = useMemo(() => ({ config }), [config]);

  return (
    <RestockContext.Provider value={value}>
      {children}
    </RestockContext.Provider>
  );
}

/**
 * Hook to access RestockBridge configuration.
 * Must be used within a RestockProvider.
 */
export function useRestockConfig(): RestockBridgeConfig {
  const context = useContext(RestockContext);

  if (!context) {
    throw new Error('useRestockConfig must be used within a RestockProvider');
  }

  return context.config;
}

export { RestockContext };
