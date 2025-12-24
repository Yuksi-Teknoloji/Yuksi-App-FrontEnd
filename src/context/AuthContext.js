import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

// AuthProvider now just triggers the initial token restore
export const AuthProvider = ({ children }) => {
  const restoreToken = useAuthStore(state => state.restoreToken);

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  return <>{children}</>;
};

// Convenience hook for accessing Zustand auth store
export const useAuth = () => {
  const isLoading = useAuthStore(state => state.isLoading);
  const isSignedIn = useAuthStore(state => state.isSignedIn);
  const userToken = useAuthStore(state => state.userToken);
  const signIn = useAuthStore(state => state.signIn);
  const signOut = useAuthStore(state => state.signOut);
  const signUp = async ({ navigation, data }) => {
    const { register } = useAuthStore.getState();
    const result = await register(data);
    if (result.ok) {
      navigation.replace('Onboarding');
    } else {
      console.log('Sign up failed:', result.error);
    }
  };

  return {
    isLoading,
    isSignedIn,
    userToken,
    signIn,
    signOut,
    signUp,
  };
};
