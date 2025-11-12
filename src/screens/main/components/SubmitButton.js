import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, ActivityIndicator} from 'react-native';

const SubmitButton = ({ title='Gönder', onPress, loading=false, disabled=false }) => {
  const isDisabled = disabled || loading;
  return (
    <View style={{alignItems:'center', marginTop: 16, marginBottom: 24}}>
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        activeOpacity={0.9}
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: { width: 344, height: 52, backgroundColor: '#FF5B04', borderRadius: 12, paddingTop: 16, paddingRight: 20, paddingBottom: 16, paddingLeft: 20, opacity: 1, justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  text: { fontFamily: 'Urbanist', fontWeight: '700', fontSize: 16, lineHeight: 20, color: '#FFFFFF' },
});

export default SubmitButton;
