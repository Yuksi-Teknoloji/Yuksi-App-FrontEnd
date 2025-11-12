import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

const UploadImageField = ({ label='Fotoğraf Ekleyin', onPress, pickedImagePath, Icon }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.inner}>
          {pickedImagePath ? (
            <Image source={{uri: pickedImagePath}} style={styles.thumb} />
          ) : (
            Icon ? <Icon width={20} height={20} /> : null
          )}
          <Text style={styles.text} numberOfLines={1}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 12 },
  trigger: { width: 340, height: 48, borderRadius: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 12, justifyContent: 'center' },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  thumb: { width: 20, height: 20, borderRadius: 4 },
  text: { fontFamily: 'Urbanist', fontWeight: '500', fontSize: 16, lineHeight: 16, color: '#A1A1AA' },
});

export default UploadImageField;
