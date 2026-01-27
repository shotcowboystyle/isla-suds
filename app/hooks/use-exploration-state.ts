import {useEffect} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useExplorationStore} from '~/stores/exploration';

/**
 * Selector hooks for exploration store
 *
 * These hooks use Zustand's selector pattern for optimal re-renders.
 * Components only re-render when their selected state changes.
 *
 * Pattern: useExplorationStore((state) => state.property)
 */

/**
 * Initialize session timestamp client-side (SSR-safe)
 * Call this hook in root layout to initialize session tracking
 *
 * This ensures sessionStartTime is set to Date.now() on first client-side mount,
 * preventing hydration mismatches while maintaining session tracking.
 */
export function useInitializeSession(): void {
  useEffect(() => {
    // Atomic update to prevent race conditions
    useExplorationStore.setState((state) => {
      // Only initialize if not already set (0 means not initialized)
      if (state.sessionStartTime === 0) {
        return {sessionStartTime: Date.now()};
      }
      return {};
    });
  }, []);
}

/**
 * Returns the Set of explored product IDs
 * Component re-renders when productsExplored changes
 */
export function useProductsExplored(): Set<string> {
  return useExplorationStore((state) => state.productsExplored);
}

/**
 * Returns the count of texture reveals triggered in this session
 * Component re-renders when textureRevealsTriggered changes
 */
export function useTextureRevealsCount(): number {
  return useExplorationStore((state) => state.textureRevealsTriggered);
}

/**
 * Returns whether the story moment has been shown
 * Component re-renders when storyMomentShown changes
 */
export function useStoryMomentShown(): boolean {
  return useExplorationStore((state) => state.storyMomentShown);
}

/**
 * Returns the session start timestamp
 * Component re-renders when sessionStartTime changes
 */
export function useSessionStartTime(): number {
  return useExplorationStore((state) => state.sessionStartTime);
}

/**
 * Returns cart drawer open state and setter function
 * Component re-renders when cartDrawerOpen changes
 *
 * @returns [isOpen, setOpen] tuple
 */
export function useCartDrawerOpen(): [boolean, (open: boolean) => void] {
  // Optimized: Single selector to avoid multiple subscriptions
  return useExplorationStore(
    useShallow((state) => [state.cartDrawerOpen, state.setCartDrawerOpen]),
  );
}

/**
 * Returns all store actions for components that need to update state
 *
 * @returns Object with all action functions
 */
export function useExplorationActions() {
  return {
    addProductExplored: useExplorationStore(
      (state) => state.addProductExplored,
    ),
    incrementTextureReveals: useExplorationStore(
      (state) => state.incrementTextureReveals,
    ),
    setStoryMomentShown: useExplorationStore(
      (state) => state.setStoryMomentShown,
    ),
    setCartDrawerOpen: useExplorationStore((state) => state.setCartDrawerOpen),
    resetSession: useExplorationStore((state) => state.resetSession),
  };
}
