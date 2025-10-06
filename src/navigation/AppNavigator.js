import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

import {useAuth} from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import LoadingScreen from '../screens/LoadingScreen';

const AppNavigator = () => {
  const {isLoading, userToken} = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {userToken == null ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default AppNavigator;
