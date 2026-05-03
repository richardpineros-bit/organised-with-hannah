import { create } from 'zustand';
import { api, getToken, storeToken, clearToken } from '../lib/api';

interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.login(email, password);
      storeToken(data.token);
      set({
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role === 'admin',
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    clearToken();
    set({ user: null, isAuthenticated: false, isAdmin: false, error: null });
  },

  checkAuth: async () => {
    const token = getToken();
    if (!token) {
      set({ isAuthenticated: false, user: null, isAdmin: false });
      return;
    }

    try {
      const data = await api.me();
      set({
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role === 'admin',
      });
    } catch {
      clearToken();
      set({ user: null, isAuthenticated: false, isAdmin: false });
    }
  },
}));
