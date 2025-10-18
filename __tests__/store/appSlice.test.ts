import { configureStore } from '@reduxjs/toolkit';
import appReducer, { setLocked, setOnline, setSelectedCategory } from '../../src/store/appSlice';
import { AppState } from '../../src/types';

type RootState = {
  app: AppState;
};

describe('appSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        app: appReducer,
      },
    }) as ReturnType<typeof configureStore<RootState>>;
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().app as AppState;
      
      expect(state).toEqual({
        isLocked: false,
        isOnline: true,
        selectedCategory: 'beauty',
      });
    });
  });

  describe('setLocked', () => {
    it('should set locked state to true', () => {
      store.dispatch(setLocked(true));

      const state = store.getState().app as AppState;
      expect(state.isLocked).toBe(true);
    });

    it('should set locked state to false', () => {
      // First set to locked
      store.dispatch(setLocked(true));
      expect(store.getState().app.isLocked).toBe(true);

      // Then unlock
      store.dispatch(setLocked(false));
      const state = store.getState().app as AppState;
      expect(state.isLocked).toBe(false);
    });
  });

  describe('setOnline', () => {
    it('should set online state to true', () => {
      store.dispatch(setOnline(true));

      const state = store.getState().app as AppState;
      expect(state.isOnline).toBe(true);
    });

    it('should set online state to false', () => {
      store.dispatch(setOnline(false));

      const state = store.getState().app as AppState;
      expect(state.isOnline).toBe(false);
    });

    it('should handle online/offline transitions', () => {
      // Start online
      let state = store.getState().app;
      expect(state.isOnline).toBe(true);

      // Go offline
      store.dispatch(setOnline(false));
      state = store.getState().app;
      expect(state.isOnline).toBe(false);

      // Come back online
      store.dispatch(setOnline(true));
      state = store.getState().app;
      expect(state.isOnline).toBe(true);
    });
  });

  describe('setSelectedCategory', () => {
    it('should set selected category', () => {
      store.dispatch(setSelectedCategory('electronics'));

      const state = store.getState().app as AppState;
      expect(state.selectedCategory).toBe('electronics');
    });

    it('should update selected category', () => {
      // Set initial category
      store.dispatch(setSelectedCategory('beauty'));
      let state = store.getState().app;
      expect(state.selectedCategory).toBe('beauty');

      // Change category
      store.dispatch(setSelectedCategory('clothing'));
      state = store.getState().app;
      expect(state.selectedCategory).toBe('clothing');
    });

    it('should handle different category types', () => {
      const categories = ['electronics', 'clothing', 'books', 'home', 'sports'];

      categories.forEach(category => {
        store.dispatch(setSelectedCategory(category));
        const state = store.getState().app as AppState;
        expect(state.selectedCategory).toBe(category);
      });
    });
  });

  describe('combined state changes', () => {
    it('should handle multiple state changes independently', () => {
      // Change multiple states
      store.dispatch(setLocked(true));
      store.dispatch(setOnline(false));
      store.dispatch(setSelectedCategory('electronics'));

      const state = store.getState().app as AppState;
      expect(state.isLocked).toBe(true);
      expect(state.isOnline).toBe(false);
      expect(state.selectedCategory).toBe('electronics');
    });

    it('should maintain other states when changing one', () => {
      // Set initial states
      store.dispatch(setLocked(true));
      store.dispatch(setOnline(false));
      store.dispatch(setSelectedCategory('books'));

      // Change only one state
      store.dispatch(setOnline(true));

      const state = store.getState().app as AppState;
      expect(state.isLocked).toBe(true); // Should remain unchanged
      expect(state.isOnline).toBe(true); // Should be updated
      expect(state.selectedCategory).toBe('books'); // Should remain unchanged
    });
  });

  describe('state persistence', () => {
    it('should maintain state across multiple dispatches', () => {
      // Set all states
      store.dispatch(setLocked(true));
      store.dispatch(setOnline(false));
      store.dispatch(setSelectedCategory('sports'));

      // Verify all states are set
      let state = store.getState().app;
      expect(state.isLocked).toBe(true);
      expect(state.isOnline).toBe(false);
      expect(state.selectedCategory).toBe('sports');

      // Make another change
      store.dispatch(setLocked(false));

      // Verify other states remain
      state = store.getState().app;
      expect(state.isLocked).toBe(false);
      expect(state.isOnline).toBe(false);
      expect(state.selectedCategory).toBe('sports');
    });
  });
});
