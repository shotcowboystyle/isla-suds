import {describe, it, expect, beforeEach, vi} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {
  useProductsExplored,
  useTextureRevealsCount,
  useStoryMomentShown,
  useSessionStartTime,
  useCartDrawerOpen,
  useExplorationActions,
  useInitializeSession,
} from './use-exploration-state';
import {useExplorationStore} from '~/stores/exploration';

describe('use-exploration-state hooks', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useExplorationStore.setState({
      productsExplored: new Set<string>(),
      textureRevealsTriggered: 0,
      storyMomentShown: false,
      sessionStartTime: 0,
      cartDrawerOpen: false,
    });
  });

  describe('useProductsExplored', () => {
    it('should return productsExplored Set', () => {
      const {result} = renderHook(() => useProductsExplored());

      expect(result.current).toBeInstanceOf(Set);
      expect(result.current.size).toBe(0);
    });

    it('should update when productsExplored changes', () => {
      const {result} = renderHook(() => useProductsExplored());

      act(() => {
        useExplorationStore.getState().addProductExplored('product-1');
      });

      expect(result.current.has('product-1')).toBe(true);
      expect(result.current.size).toBe(1);
    });
  });

  describe('useTextureRevealsCount', () => {
    it('should return textureRevealsTriggered count', () => {
      const {result} = renderHook(() => useTextureRevealsCount());

      expect(result.current).toBe(0);
    });

    it('should update when textureRevealsTriggered changes', () => {
      const {result} = renderHook(() => useTextureRevealsCount());

      act(() => {
        useExplorationStore.getState().incrementTextureReveals();
      });

      expect(result.current).toBe(1);
    });
  });

  describe('useStoryMomentShown', () => {
    it('should return storyMomentShown boolean', () => {
      const {result} = renderHook(() => useStoryMomentShown());

      expect(result.current).toBe(false);
    });

    it('should update when storyMomentShown changes', () => {
      const {result} = renderHook(() => useStoryMomentShown());

      act(() => {
        useExplorationStore.getState().setStoryMomentShown(true);
      });

      expect(result.current).toBe(true);
    });
  });

  describe('useSessionStartTime', () => {
    it('should return sessionStartTime number', () => {
      const {result} = renderHook(() => useSessionStartTime());

      expect(result.current).toBe(0);
    });

    it('should update when sessionStartTime changes', () => {
      const {result} = renderHook(() => useSessionStartTime());
      const timestamp = Date.now();

      act(() => {
        useExplorationStore.setState({sessionStartTime: timestamp});
      });

      expect(result.current).toBe(timestamp);
    });
  });

  describe('useCartDrawerOpen', () => {
    it('should return [isOpen, setOpen] tuple', () => {
      const {result} = renderHook(() => useCartDrawerOpen());

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(2);
      expect(typeof result.current[0]).toBe('boolean');
      expect(typeof result.current[1]).toBe('function');
    });

    it('should return current cartDrawerOpen state', () => {
      const {result} = renderHook(() => useCartDrawerOpen());

      expect(result.current[0]).toBe(false);
    });

    it('should update when cartDrawerOpen changes', () => {
      const {result} = renderHook(() => useCartDrawerOpen());

      act(() => {
        useExplorationStore.getState().setCartDrawerOpen(true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('should allow setting cartDrawerOpen via setter', () => {
      const {result} = renderHook(() => useCartDrawerOpen());

      act(() => {
        result.current[1](true);
      });

      expect(useExplorationStore.getState().cartDrawerOpen).toBe(true);
    });
  });

  describe('useExplorationActions', () => {
    it('should return all action functions', () => {
      const {result} = renderHook(() => useExplorationActions());

      expect(result.current).toHaveProperty('addProductExplored');
      expect(result.current).toHaveProperty('incrementTextureReveals');
      expect(result.current).toHaveProperty('setStoryMomentShown');
      expect(result.current).toHaveProperty('setCartDrawerOpen');
      expect(result.current).toHaveProperty('resetSession');

      expect(typeof result.current.addProductExplored).toBe('function');
      expect(typeof result.current.incrementTextureReveals).toBe('function');
      expect(typeof result.current.setStoryMomentShown).toBe('function');
      expect(typeof result.current.setCartDrawerOpen).toBe('function');
      expect(typeof result.current.resetSession).toBe('function');
    });

    it('should allow calling actions', () => {
      const {result} = renderHook(() => useExplorationActions());

      act(() => {
        result.current.addProductExplored('product-1');
        result.current.incrementTextureReveals();
        result.current.setStoryMomentShown(true);
        result.current.setCartDrawerOpen(true);
      });

      const state = useExplorationStore.getState();
      expect(state.productsExplored.has('product-1')).toBe(true);
      expect(state.textureRevealsTriggered).toBe(1);
      expect(state.storyMomentShown).toBe(true);
      expect(state.cartDrawerOpen).toBe(true);
    });
  });

  describe('useInitializeSession', () => {
    it('should initialize sessionStartTime on mount', () => {
      // Mock Date.now to return a specific timestamp
      const mockTimestamp = 1234567890;
      vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

      // Reset store to uninitialized state
      useExplorationStore.setState({sessionStartTime: 0});

      renderHook(() => useInitializeSession());

      // Wait for useEffect to run
      act(() => {
        // useEffect should have run
      });

      const state = useExplorationStore.getState();
      expect(state.sessionStartTime).toBe(mockTimestamp);

      vi.restoreAllMocks();
    });

    it('should not overwrite existing sessionStartTime', () => {
      const existingTimestamp = 9999999999;
      useExplorationStore.setState({sessionStartTime: existingTimestamp});

      const mockTimestamp = 1234567890;
      vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

      renderHook(() => useInitializeSession());

      act(() => {
        // useEffect should have run
      });

      const state = useExplorationStore.getState();
      // Should not have changed
      expect(state.sessionStartTime).toBe(existingTimestamp);

      vi.restoreAllMocks();
    });

    it('should handle race condition (atomic update)', () => {
      const mockTimestamp1 = 1000;
      const mockTimestamp2 = 2000;

      useExplorationStore.setState({sessionStartTime: 0});

      // Simulate two components mounting simultaneously
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockTimestamp1)
        .mockReturnValueOnce(mockTimestamp2);

      const {result: result1} = renderHook(() => useInitializeSession());
      const {result: result2} = renderHook(() => useInitializeSession());

      act(() => {
        // Both useEffects should have run
      });

      const state = useExplorationStore.getState();
      // Should be one of the timestamps (first one to win the race)
      expect([mockTimestamp1, mockTimestamp2]).toContain(state.sessionStartTime);

      vi.restoreAllMocks();
    });
  });
});
