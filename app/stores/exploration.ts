import {create} from 'zustand';

/**
 * Exploration store state interface
 * Manages UI state for non-linear product exploration, texture reveals, and cart drawer
 */
export interface ExplorationState {
  // Product exploration tracking
  productsExplored: Set<string>;

  // Texture reveal metrics
  textureRevealsTriggered: number;

  // Story moment state
  storyMomentShown: boolean;

  // Session tracking
  sessionStartTime: number;

  // Cart drawer UI state
  cartDrawerOpen: boolean;

  // Actions
  addProductExplored: (productId: string) => void;
  incrementTextureReveals: () => void;
  setStoryMomentShown: (shown: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  resetSession: () => void;
}

/**
 * Exploration store
 *
 * Zustand store for UI-only state management:
 * - Product exploration tracking (which products user has seen)
 * - Texture reveal interaction count
 * - Story moment display state
 * - Session tracking for analytics
 * - Cart drawer visibility
 *
 * CRITICAL: This store is for UI state ONLY
 * - Cart operations use Hydrogen Cart Context
 * - Server state uses React Router loaders
 * - Session state is ephemeral (not persisted to localStorage)
 */
export const useExplorationStore = create<ExplorationState>((set) => ({
  // Initial state
  productsExplored: new Set<string>(),
  textureRevealsTriggered: 0,
  storyMomentShown: false,
  // SSR-safe: Initialize to 0, will be set client-side on first mount
  sessionStartTime: 0,
  cartDrawerOpen: false,

  // Actions
  addProductExplored: (productId: string) => {
    // Validate input
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      console.warn('addProductExplored: Invalid productId', productId);
      return;
    }
    set((state) => ({
      // CRITICAL: Create new Set instance for immutability
      productsExplored: new Set([...state.productsExplored, productId]),
    }));
  },

  incrementTextureReveals: () =>
    set((state) => ({
      textureRevealsTriggered: state.textureRevealsTriggered + 1,
    })),

  setStoryMomentShown: (shown: boolean) =>
    set({
      storyMomentShown: shown,
    }),

  setCartDrawerOpen: (open: boolean) =>
    set({
      cartDrawerOpen: open,
    }),

  resetSession: () => {
    // Reset all session state (client-side only, so Date.now() is safe)
    set({
      productsExplored: new Set<string>(),
      textureRevealsTriggered: 0,
      storyMomentShown: false,
      sessionStartTime: Date.now(),
      cartDrawerOpen: false,
    });
  },
}));
