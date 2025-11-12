import React from 'react';
import {View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native';

const CouponRow = ({ value, onChangeText, onApply, applying=false, applied=false, disabled=false, error }) => {
  const isDisabled = disabled || applying || !value?.trim();
  return (
    <View style={styles.row}>
      <View style={[styles.box, {flex: 6}]}> 
        <View style={styles.inner}>
          <TextInput
            style={styles.input}
            placeholder="Kupon Kodu"
            placeholderTextColor="#A1A1AA"
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="characters"
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.applyBtn, {flex: 3}, isDisabled && styles.applyBtnDisabled, applied && styles.applyBtnApplied]}
        activeOpacity={0.8}
        onPress={onApply}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        {applying ? (
          <ActivityIndicator color={applied ? '#FFFFFF' : '#FF5B04'} />
        ) : (
          <Text style={[styles.applyText, applied && styles.applyTextApplied]}>{applied ? 'Uygulandı' : 'Uygula'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { marginTop: 12, width: 340, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 12 },
  box: { height: 56, borderRadius: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 12, justifyContent: 'center' },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, fontFamily: 'Urbanist', fontSize: 16, lineHeight: 20, color: '#0F172A' },
  applyBtn: { height: 56, borderRadius: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  applyBtnDisabled: { opacity: 0.5 },
  applyBtnApplied: { backgroundColor: '#22C55E' },
  applyText: { fontFamily: 'Urbanist', fontWeight: '600', fontSize: 16, lineHeight: 20, color: '#FF5B04' },
  applyTextApplied: { color: '#FFFFFF', fontWeight: '700' },
});

export default CouponRow;
