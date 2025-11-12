import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const SplitTotalRow = ({ Icon, label, value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelWrap}>
        {Icon ? <Icon width={20} height={20} /> : null}
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Tutar"
          placeholderTextColor="#A1A1AA"
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 12, width: 340, alignSelf: 'center', height: 56, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  labelWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  labelText: { fontFamily: 'Urbanist', fontWeight: '500', fontSize: 16, lineHeight: 20, color: '#0F172A' },
  inputWrap: { height: 44, minWidth: 120, maxWidth: 160, borderRadius: 12, borderWidth: 2, borderColor: '#FF5B04', paddingHorizontal: 12, justifyContent: 'center' },
  input: { fontFamily: 'Urbanist', fontSize: 16, lineHeight: 20, color: '#0F172A' },
});

export default SplitTotalRow;
