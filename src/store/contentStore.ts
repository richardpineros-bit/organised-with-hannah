import { create } from 'zustand';
import { api } from '../lib/api';

interface ContentState {
  content: Record<string, Record<string, any>>;
  isLoading: boolean;
  error: string | null;
  fetchContent: () => Promise<void>;
  getSection: (section: string) => Record<string, any>;
  getValue: (section: string, key: string, defaultValue?: string) => string;
  updateContent: (section: string, key: string, value: string) => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  content: {},
  isLoading: false,
  error: null,

  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getContent();
      set({ content: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getSection: (section: string) => {
    return get().content[section] || {};
  },

  getValue: (section: string, key: string, defaultValue = '') => {
    return get().content[section]?.[key] || defaultValue;
  },

  updateContent: async (section: string, key: string, value: string) => {
    try {
      await api.updateContent(section, key, value);
      set((state) => ({
        content: {
          ...state.content,
          [section]: {
            ...state.content[section],
            [key]: value,
          },
        },
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
