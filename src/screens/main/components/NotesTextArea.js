import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const NotesTextArea = ({ label, placeholder, value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            multiline
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
  container: { alignItems: 'center', marginTop: 12 },
  wrapper: { width: 340 },
  label: {
    fontFamily: 'Urbanist', fontWeight: '500', fontSize: 16, lineHeight: 20, color: '#A1A1AA', marginBottom: 6,
  },
  box: {
    width: 340, height: 128, borderRadius: 12, backgroundColor: '#FFFFFF', padding: 12,
  },
  input: {
    flex: 1, fontFamily: 'Urbanist', fontSize: 16, lineHeight: 20, color: '#0F172A', textAlignVertical: 'top',
  },
});

export default NotesTextArea;
