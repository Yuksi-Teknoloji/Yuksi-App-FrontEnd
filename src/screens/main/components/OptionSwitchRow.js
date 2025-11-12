import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import OutlineSwitch from './OutlineSwitch';

const OptionSwitchRow = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.row}>
      <View style={[styles.leftBox, {flex: 6}]}> 
        <View style={styles.leftInner}>
          <Text style={styles.leftText}>{label}</Text>
        </View>
      </View>
      <View style={[styles.rightBox, {flex: 3}]}> 
        <OutlineSwitch value={value} onValueChange={onValueChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { marginTop: 12, width: 340, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 12 },
  leftBox: { height: 56, borderRadius: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 12, justifyContent: 'center' },
  leftInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leftText: { fontFamily: 'Urbanist', fontWeight: '500', fontSize: 16, lineHeight: 20, color: '#0F172A' },
  rightBox: { height: 56, alignItems: 'center', justifyContent: 'center' },
});

export default OptionSwitchRow;
