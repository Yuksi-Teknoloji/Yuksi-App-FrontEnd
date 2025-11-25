import { create } from 'zustand';
import { userApi } from '../api/userApi';

export const useAuthStore = create((set, get) => ({
  registering: false,
  registerError: null,
  registerResponse: null,

  async register({ email, password, phone, first_name, last_name }) {
    set({ registering: true, registerError: null });
    try {
      const res = await userApi.register({ email, password, phone, first_name, last_name });
      set({ registerResponse: res, registering: false });
      console.log('res res res ', res)
      return { ok: true, data: res };
    } catch (err) {
      set({ registerError: err.message || 'Registration failed', registering: false });
      return { ok: false, error: err };
    }
  },

  clearRegisterState() {
    set({ registering: false, registerError: null, registerResponse: null });
  },
}));
