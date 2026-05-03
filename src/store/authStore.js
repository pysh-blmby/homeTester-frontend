import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (phone, otp) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/verify-otp', { phone, otp });
          set({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error(error);
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data, isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
