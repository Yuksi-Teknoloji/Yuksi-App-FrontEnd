import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const LabeledInput = ({ label, placeholder, icon: Icon, value, onChangeText, invisibleLabel=false }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, invisibleLabel && styles.labelInvisible]}>{label}</Text>
      <View style={styles.box}>
        <View style={styles.inner}>
          {Icon ? (
            <View style={styles.iconBox}><Icon width={20} height={20} /></View>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#A1A1AA"
            value={value}
            onChangeText={onChangeText}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: 340 },
  label: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#A1A1AA',
    marginBottom: 6,
  },
  labelInvisible: { opacity: 0 },
  box: {
    width: 340, height: 56, borderRadius: 12, backgroundColor: '#FFFFFF',
    paddingHorizontal: 12, justifyContent: 'center'
  },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontFamily: 'Urbanist', fontSize: 16, lineHeight: 20, color: '#0F172A' }
});

export default LabeledInput;
