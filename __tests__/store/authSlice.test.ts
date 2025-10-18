import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setCredentials, logout } from '../../src/store/authSlice';
import { User } from '../../src/types';

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      
      expect(state).toEqual({
        user: null,
        token: null,
        isAuthenticated: false,
        isSuperadmin: false,
      });
    });
  });

  describe('setCredentials', () => {
    it('should set user credentials and mark as authenticated', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        image: 'mock-image.jpg',
      };

      const token = 'mock-token';

      store.dispatch(setCredentials({ user, token }));

      const state = store.getState().auth;
      expect(state.user).toEqual(user);
      expect(state.token).toBe(token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isSuperadmin).toBe(false);
    });

    it('should mark user as superadmin when username is emilys', () => {
      const superadminUser: User = {
        id: 1,
        username: 'emilys',
        email: 'emily@example.com',
        firstName: 'Emily',
        lastName: 'Smith',
        gender: 'female',
        image: 'emily-image.jpg',
      };

      const token = 'superadmin-token';

      store.dispatch(setCredentials({ user: superadminUser, token }));

      const state = store.getState().auth;
      expect(state.user).toEqual(superadminUser);
      expect(state.token).toBe(token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isSuperadmin).toBe(true);
    });

    it('should not mark user as superadmin for other usernames', () => {
      const regularUser: User = {
        id: 2,
        username: 'michaelw',
        email: 'michael@example.com',
        firstName: 'Michael',
        lastName: 'Wilson',
        gender: 'male',
        image: 'michael-image.jpg',
      };

      const token = 'regular-token';

      store.dispatch(setCredentials({ user: regularUser, token }));

      const state = store.getState().auth;
      expect(state.user).toEqual(regularUser);
      expect(state.token).toBe(token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isSuperadmin).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear all auth state on logout', () => {
      // First set some credentials
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        image: 'mock-image.jpg',
      };

      store.dispatch(setCredentials({ user, token: 'mock-token' }));

      // Verify state is set
      let state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);

      // Now logout
      store.dispatch(logout());

      // Verify state is cleared
      state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isSuperadmin).toBe(false);
    });

    it('should handle logout when already logged out', () => {
      // Ensure initial state
      let state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);

      // Dispatch logout
      store.dispatch(logout());

      // State should remain unchanged
      state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isSuperadmin).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should handle multiple login/logout cycles', () => {
      const user1: User = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        gender: 'male',
        image: 'user1.jpg',
      };

      const user2: User = {
        id: 2,
        username: 'emilys',
        email: 'emily@example.com',
        firstName: 'Emily',
        lastName: 'Smith',
        gender: 'female',
        image: 'emily.jpg',
      };

      // Login user1
      store.dispatch(setCredentials({ user: user1, token: 'token1' }));
      let state = store.getState().auth;
      expect(state.user).toEqual(user1);
      expect(state.isSuperadmin).toBe(false);

      // Logout
      store.dispatch(logout());
      state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);

      // Login user2 (superadmin)
      store.dispatch(setCredentials({ user: user2, token: 'token2' }));
      state = store.getState().auth;
      expect(state.user).toEqual(user2);
      expect(state.isSuperadmin).toBe(true);

      // Logout again
      store.dispatch(logout());
      state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
