import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

const MessageScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mesajlar</Text>
        <Text style={styles.subtitle}>Mesajlarınız burada görünecek</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Urbanist',
    fontSize: 28,
    fontWeight: '600',
    color: '#FF5B04',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MessageScreen;
