import {describe, it, expect, beforeEach, vi} from 'vitest';
import {renderHook} from '@testing-library/react';
import {useCollectionPromptTrigger} from './use-collection-prompt-trigger';
import {useExplorationStore} from '~/stores/exploration';

/**
 * Tests for useCollectionPromptTrigger hook (Story 4.2, Task 3)
 *
 * Verifies:
 * AC1: Trigger after 2+ products explored
 * AC2: Prevent re-trigger if storyMomentShown is true
 * AC3: Prevent trigger if variety pack is in cart
 * SSR safety
 */

// NOTE: Cart checking is stubbed in the hook until Story 4.3 is implemented
// Tests verify the logic works correctly when real cart data is available

describe('useCollectionPromptTrigger', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useExplorationStore.setState({
      productsExplored: new Set<string>(),
      storyMomentShown: false,
      textureRevealsTriggered: 0,
      sessionStartTime: Date.now(),
      cartDrawerOpen: false,
      addProductExplored: useExplorationStore.getState().addProductExplored,
      incrementTextureReveals:
        useExplorationStore.getState().incrementTextureReveals,
      setStoryMomentShown: useExplorationStore.getState().setStoryMomentShown,
      setCartDrawerOpen: useExplorationStore.getState().setCartDrawerOpen,
      resetSession: useExplorationStore.getState().resetSession,
    });

    vi.clearAllMocks();
  });

  describe('AC1 - Trigger after 2+ products explored', () => {
    it('returns false when 0 products explored', () => {
      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('returns false when 1 product explored', () => {
      // Add 1 product
      useExplorationStore.getState().addProductExplored('product-1');

      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('returns true when exactly 2 products explored', () => {
      // Add 2 products
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(true);
    });

    it('returns true when 3+ products explored', () => {
      // Add 3 products
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');
      useExplorationStore.getState().addProductExplored('product-3');

      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(true);
    });
  });

  describe('AC2 - Prevent re-trigger if storyMomentShown', () => {
    it('returns false when storyMomentShown is true (even with 2+ products)', () => {
      // Add 2 products
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Mark story moment as shown
      useExplorationStore.getState().setStoryMomentShown(true);

      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('returns true when storyMomentShown is false with 2+ products', () => {
      // Add 2 products
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Explicitly set to false (default state)
      useExplorationStore.getState().setStoryMomentShown(false);

      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(true);
    });
  });

  describe('AC3 - Prevent trigger if variety pack is in cart', () => {
    it('[P0] returns false when variety pack (bundle) is in cart (Story 4.3)', () => {
      // Add 2 products to exploration (meets AC1)
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Mock cart lines with variety pack identified by productType = 'Bundle'
      const mockCartLines = [
        {
          merchandise: {
            product: {
              productType: 'Bundle',
              handle: 'four-bar-variety-pack',
            },
          },
        },
      ];

      const {result} = renderHook(() =>
        useCollectionPromptTrigger({cartLines: mockCartLines}),
      );

      // Should return false because variety pack is in cart (AC3)
      expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('[P0] returns false when variety pack (handle: variety-pack) is in cart (Story 4.3)', () => {
      // Add 2 products to exploration (meets AC1)
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Mock cart lines with variety pack identified by handle
      const mockCartLines = [
        {
          merchandise: {
            product: {
              productType: 'Soap Bar',
              handle: 'variety-pack',
            },
          },
        },
      ];

      const {result} = renderHook(() =>
        useCollectionPromptTrigger({cartLines: mockCartLines}),
      );

      // Should return false because variety pack is in cart (AC3)
      expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('[P1] returns false when variety pack (handle: four-bar-variety-pack) is in cart', () => {
      // Add 2 products to exploration (meets AC1)
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Mock cart lines with variety pack identified by full handle
      const mockCartLines = [
        {
          merchandise: {
            product: {
              productType: 'Soap Bar',
              handle: 'four-bar-variety-pack',
            },
          },
        },
      ];

      const {result} = renderHook(() =>
        useCollectionPromptTrigger({cartLines: mockCartLines}),
      );

      // Should return false because variety pack is in cart (AC3)
      expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('[P1] returns true when cart has other products but NOT variety pack', () => {
      // Add 2 products to exploration (meets AC1)
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Mock cart lines with regular products (NOT variety pack)
      const mockCartLines = [
        {
          merchandise: {
            product: {
              productType: 'Soap Bar',
              handle: 'lavender-dreams',
            },
          },
        },
        {
          merchandise: {
            product: {
              productType: 'Soap Bar',
              handle: 'eucalyptus-refresh',
            },
          },
        },
      ];

      const {result} = renderHook(() =>
        useCollectionPromptTrigger({cartLines: mockCartLines}),
      );

      // Should return true because variety pack is NOT in cart
      expect(result.current.shouldShowPrompt).toBe(true);
    });

    it('returns true when cart is empty', () => {
      // Add 2 products to exploration
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Empty cart (cartLines = [])
      const {result} = renderHook(() => useCollectionPromptTrigger({cartLines: []}));
      expect(result.current.shouldShowPrompt).toBe(true);
    });

    it('[P1] returns true when cartLines is undefined (SSR-safe)', () => {
      // Add 2 products to exploration
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Cart lines undefined (SSR or initial load)
      const {result} = renderHook(() =>
        useCollectionPromptTrigger({cartLines: undefined}),
      );

      // Should return true (graceful fallback)
      expect(result.current.shouldShowPrompt).toBe(true);
    });

    it('[P2] returns true when cartLines is null (SSR-safe)', () => {
      // Add 2 products to exploration
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Cart lines null (SSR or initial load)
      const {result} = renderHook(() =>
        useCollectionPromptTrigger({cartLines: null}),
      );

      // Should return true (graceful fallback)
      expect(result.current.shouldShowPrompt).toBe(true);
    });
  });

  describe('SSR safety', () => {
    it('does not crash when rendering (SSR-safe)', () => {
      // Add 2 products to exploration
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');

      // Hook should render without errors
      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(true);
    });
  });

  describe('Combined conditions', () => {
    it('returns false when all block conditions are met', () => {
      // All blocking conditions:
      // 1. Less than 2 products explored
      useExplorationStore.getState().addProductExplored('product-1');

      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('returns true only when all trigger conditions are met', () => {
      // All trigger conditions:
      // 1. 2+ products explored
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');
      // 2. storyMomentShown = false (default)
      // 3. variety pack NOT in cart (default empty cart)

      const {result} = renderHook(() => useCollectionPromptTrigger());
      expect(result.current.shouldShowPrompt).toBe(true);
    });
  });
});
