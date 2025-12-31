import { create } from 'zustand';
import { userApi } from '../api/userApi';
import { getItem, setItem, removeItem } from '../utils/storage';

export const useAuthStore = create((set, get) => ({
  // Global auth state
  isLoading: true,
  isSignedIn: false,
  userToken: null,

  // Registration state
  registering: false,
  registerError: null,
  registerResponse: null,

  // Sign-in state
  signingIn: false,
  signInError: null,
  signInResponse: null,

  // Bootstrap: restore token from storage
  async restoreToken() {
    set({ isLoading: true });
    try {
      const userToken = await getItem('userToken');
      console.log('🔄 Restoring token from storage:', userToken ? `${userToken.substring(0, 20)}...` : 'null');
      setTimeout(() => {
        set({
          userToken,
          isSignedIn: !!userToken, // Set isSignedIn based on token presence
          isLoading: false
        });
        console.log('✅ Token restored, isSignedIn:', !!userToken);
      }, 3000);
    } catch (e) {
      console.error('❌ Token loading error:', e);
      set({ isLoading: false, isSignedIn: false, userToken: null });
    }
  },

  // Registration flow
  async register({ email, password, phone, first_name, last_name }) {
    set({ registering: true, registerError: null });
    try {
      const res = await userApi.register({ email, password, phone, first_name, last_name });
      set({ registerResponse: res, registering: false });
      return { ok: true, data: res };
    } catch (err) {
      // Prioritize response.message from API
      let errorMessage = err.data?.message || err.message;
      
      // Fall back to status-based messages if no API message
      if (!errorMessage || errorMessage === 'Registration failed' || errorMessage === 'Request failed') {
        if (err.status === 409) {
          errorMessage = 'Bu e-posta adresi zaten kayıtlı.';
        } else if (err.status === 400) {
          errorMessage = 'Geçersiz bilgiler. Lütfen kontrol edin.';
        } else if (err.status >= 500) {
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else {
          errorMessage = 'Kayıt işlemi başarısız. Lütfen tekrar deneyin.';
        }
      }
      
      console.log('Registration error:', { status: err.status, message: errorMessage, data: err.data });
      set({ registerError: errorMessage, registering: false });
      return { ok: false, error: err, message: errorMessage };
    }
  },

  clearRegisterState() {
    set({ registering: false, registerError: null, registerResponse: null });
  },

  // Sign-in flow
  async signIn({ email, password }) {
    set({ signingIn: true, signInError: null });
          console.log('before request')

    try {
      const res = await userApi.login({ email, password });
      
      // Only proceed if we have a valid token
      // if (!res?.token) {
      //   throw new Error('Token bulunamadı. Lütfen tekrar deneyin.');
      // }
      console.log('✅ Login successful, response:', res);
      const token = res.data.accessToken;
      console.log('💾 Saving token to storage:', token ? `${token.substring(0, 20)}...` : 'null');
      await setItem('userToken', token);
      console.log('✅ Token saved to storage successfully');
      set({
        signInResponse: res,
        signingIn: false,
        isSignedIn: true,
        userToken: token,
        signInError: null
      });
      console.log('✅ Auth state updated: isSignedIn=true');
      return { ok: true, data: res };
    } catch (err) {
      // Prioritize response.message from API
      let errorMessage = err.data?.message || err.message;
            console.log('Raw registration error:', err);
      // Fall back to status-based messages if no API message
      if (!errorMessage || errorMessage === 'Login failed' || errorMessage === 'Request failed') {
        if (err.status === 401 || err.status === 403) {
          errorMessage = 'E-posta veya şifre hatalı.';
        } else if (err.status === 404) {
          errorMessage = 'Kullanıcı bulunamadı.';
        } else if (err.status === 429) {
          errorMessage = 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.';
        } else if (err.status >= 500) {
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else {
          errorMessage = 'Giriş yapılamadı. Lütfen tekrar deneyin.';
        }
      }
      
      console.log('Login error:', { status: err.status, message: errorMessage, data: err.data });
      
      // Ensure user is NOT signed in on error
      set({ 
        signInError: errorMessage, 
        signingIn: false,
        isSignedIn: false,
        userToken: null 
      });
      return { ok: false, error: err, message: errorMessage };
    }
  },

  clearSignInState() {
    set({ signingIn: false, signInError: null, signInResponse: null });
  },

  // Sign-out
  async signOut() {
    try {
      await removeItem('userToken');
      set({ isSignedIn: false, userToken: null });
    } catch (error) {
      console.log('Sign out error:', error);
    }
  },
}));
