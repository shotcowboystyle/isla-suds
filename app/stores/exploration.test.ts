import {describe, it, expect, beforeEach, vi} from 'vitest';
import {useExplorationStore} from './exploration';

describe('Exploration Store', () => {
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

  describe('Initial State', () => {
    it('should initialize with empty productsExplored Set', () => {
      const state = useExplorationStore.getState();
      expect(state.productsExplored).toBeInstanceOf(Set);
      expect(state.productsExplored.size).toBe(0);
    });

    it('should initialize textureRevealsTriggered to 0', () => {
      const state = useExplorationStore.getState();
      expect(state.textureRevealsTriggered).toBe(0);
    });

    it('should initialize storyMomentShown to false', () => {
      const state = useExplorationStore.getState();
      expect(state.storyMomentShown).toBe(false);
    });

    it('should initialize sessionStartTime to 0 (SSR-safe)', () => {
      const state = useExplorationStore.getState();
      expect(state.sessionStartTime).toBe(0);
    });

    it('should initialize cartDrawerOpen to false', () => {
      const state = useExplorationStore.getState();
      expect(state.cartDrawerOpen).toBe(false);
    });
  });

  describe('addProductExplored', () => {
    it('should add a valid product ID to productsExplored Set', () => {
      const productId = 'product-123';
      useExplorationStore.getState().addProductExplored(productId);

      const state = useExplorationStore.getState();
      expect(state.productsExplored.has(productId)).toBe(true);
      expect(state.productsExplored.size).toBe(1);
    });

    it('should create a new Set instance (immutability)', () => {
      const initialState = useExplorationStore.getState();
      const initialSet = initialState.productsExplored;

      useExplorationStore.getState().addProductExplored('product-1');

      const newState = useExplorationStore.getState();
      expect(newState.productsExplored).not.toBe(initialSet);
      expect(newState.productsExplored).toBeInstanceOf(Set);
    });

    it('should add multiple product IDs', () => {
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-2');
      useExplorationStore.getState().addProductExplored('product-3');

      const state = useExplorationStore.getState();
      expect(state.productsExplored.size).toBe(3);
      expect(state.productsExplored.has('product-1')).toBe(true);
      expect(state.productsExplored.has('product-2')).toBe(true);
      expect(state.productsExplored.has('product-3')).toBe(true);
    });

    it('should not add duplicate product IDs', () => {
      useExplorationStore.getState().addProductExplored('product-1');
      useExplorationStore.getState().addProductExplored('product-1');

      const state = useExplorationStore.getState();
      expect(state.productsExplored.size).toBe(1);
    });

    it('should reject empty string productId', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const initialState = useExplorationStore.getState();
      const initialSize = initialState.productsExplored.size;

      useExplorationStore.getState().addProductExplored('');

      const state = useExplorationStore.getState();
      expect(state.productsExplored.size).toBe(initialSize);
      expect(consoleSpy).toHaveBeenCalledWith(
        'addProductExplored: Invalid productId',
        '',
      );
      consoleSpy.mockRestore();
    });

    it('should reject whitespace-only productId', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const initialState = useExplorationStore.getState();
      const initialSize = initialState.productsExplored.size;

      useExplorationStore.getState().addProductExplored('   ');

      const state = useExplorationStore.getState();
      expect(state.productsExplored.size).toBe(initialSize);
      expect(consoleSpy).toHaveBeenCalledWith(
        'addProductExplored: Invalid productId',
        '   ',
      );
      consoleSpy.mockRestore();
    });
  });

  describe('incrementTextureReveals', () => {
    it('should increment textureRevealsTriggered by 1', () => {
      useExplorationStore.getState().incrementTextureReveals();

      const state = useExplorationStore.getState();
      expect(state.textureRevealsTriggered).toBe(1);
    });

    it('should increment multiple times', () => {
      useExplorationStore.getState().incrementTextureReveals();
      useExplorationStore.getState().incrementTextureReveals();
      useExplorationStore.getState().incrementTextureReveals();

      const state = useExplorationStore.getState();
      expect(state.textureRevealsTriggered).toBe(3);
    });
  });

  describe('setStoryMomentShown', () => {
    it('should set storyMomentShown to true', () => {
      useExplorationStore.getState().setStoryMomentShown(true);

      const state = useExplorationStore.getState();
      expect(state.storyMomentShown).toBe(true);
    });

    it('should set storyMomentShown to false', () => {
      useExplorationStore.setState({storyMomentShown: true});
      useExplorationStore.getState().setStoryMomentShown(false);

      const state = useExplorationStore.getState();
      expect(state.storyMomentShown).toBe(false);
    });
  });

  describe('setCartDrawerOpen', () => {
    it('should set cartDrawerOpen to true', () => {
      useExplorationStore.getState().setCartDrawerOpen(true);

      const state = useExplorationStore.getState();
      expect(state.cartDrawerOpen).toBe(true);
    });

    it('should set cartDrawerOpen to false', () => {
      useExplorationStore.setState({cartDrawerOpen: true});
      useExplorationStore.getState().setCartDrawerOpen(false);

      const state = useExplorationStore.getState();
      expect(state.cartDrawerOpen).toBe(false);
    });
  });

  describe('resetSession', () => {
    it('should reset all state to initial values', () => {
      // Set up some state
      useExplorationStore.setState({
        productsExplored: new Set(['product-1', 'product-2']),
        textureRevealsTriggered: 5,
        storyMomentShown: true,
        sessionStartTime: 1234567890,
        cartDrawerOpen: true,
      });

      // Reset
      useExplorationStore.getState().resetSession();

      const state = useExplorationStore.getState();
      expect(state.productsExplored.size).toBe(0);
      expect(state.textureRevealsTriggered).toBe(0);
      expect(state.storyMomentShown).toBe(false);
      expect(state.cartDrawerOpen).toBe(false);
      // sessionStartTime should be set to current timestamp (not 0)
      expect(state.sessionStartTime).toBeGreaterThan(0);
    });

    it('should create new Set instance on reset', () => {
      const oldSet = new Set(['product-1']);
      useExplorationStore.setState({productsExplored: oldSet});

      useExplorationStore.getState().resetSession();

      const state = useExplorationStore.getState();
      expect(state.productsExplored).not.toBe(oldSet);
      expect(state.productsExplored).toBeInstanceOf(Set);
    });
  });
});
