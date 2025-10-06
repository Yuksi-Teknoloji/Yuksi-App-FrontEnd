import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LoadingScreen = () => {
  return (
    <LinearGradient
      colors={['#FF5B04', '#FFFFFF', '#FF5B04']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[-0.1232, 0.5112, 1.4008]}
    >
      <ActivityIndicator size="large" color="#FF5B04" />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
