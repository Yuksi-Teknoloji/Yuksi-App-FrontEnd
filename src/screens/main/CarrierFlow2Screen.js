import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CarrierFlow2Screen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Haritada görüntüleme</Text>
      <Text style={styles.subtitle}>Carrier Flow 2 placeholder screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default CarrierFlow2Screen;
