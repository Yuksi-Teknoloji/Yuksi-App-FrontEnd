import React, {createContext, useContext, useReducer, useEffect} from 'react';
import {getItem, setItem, removeItem} from '../utils/storage';
import { useAuthStore } from '../store/authStore';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignedIn: true,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignedIn: false,
        userToken: null,
      };
    default:
      return state;
  }
};

const initialState = {
  isLoading: true,
  isSignedIn: false,
  userToken: null,
};

export const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Uygulama açılırken token kontrolü
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await getItem('userToken');
      } catch (e) {
        // Token yükleme hatası
        console.log('Token loading error:', e);
      }

      // Wait for 3 seconds before hiding the loading screen
      setTimeout(() => {
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      }, 3000);
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async data => {
      // Burada gerçek API çağrısı yapılacak
      try {
        const userToken = 'dummy-auth-token'; // API'den gelecek token
        await setItem('userToken', userToken);
        dispatch({type: 'SIGN_IN', token: userToken});
      } catch (error) {
        console.log('Sign in error:', error);
      }
    },
    signOut: async () => {
      try {
        await removeItem('userToken');
        dispatch({type: 'SIGN_OUT'});
      } catch (error) {
        console.log('Sign out error:', error);
      }
    },
    signUp: async ({ navigation, data }) => {
      // Kullanıcı kayıt akışı: Zustand store üzerinden API'ye bağlan
      try {
        const { register } = useAuthStore.getState();
        const result = await register(data);
        if (result.ok) {
          // Kayıt başarılı, onboarding'e yönlendir
          // Not: API token döndürürse burada setItem ve SIGN_IN akışı güncellenebilir
          navigation.replace('Onboarding');
        } else {
          console.log('Sign up failed:', result.error);
        }
      } catch (error) {
        console.log('Sign up error:', error);
      }
    },
  };

  return (
    <AuthContext.Provider value={{...state, ...authContext}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
