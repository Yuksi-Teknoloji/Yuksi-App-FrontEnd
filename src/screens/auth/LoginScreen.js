import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import YuksiLogo from '../../assets/images/yuksi-vektor-logo.svg';

const LoginScreen = ({navigation}) => {
  const {signIn} = useAuth();
  const motorAnimation = useRef(new Animated.Value(300)).current; // Başlangıç pozisyonu sağ dışından

  useEffect(() => {
    // Motor animation - from right to center
    Animated.spring(motorAnimation, {
      toValue: 0, // Normal konumuna gelecek
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [motorAnimation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5B04" />

      {/* MainContainer */}
      <View style={styles.mainContainer}>
        {/* Orange Section */}
        <View style={styles.orangeSection}>
          {/* Yüksi Logo */}
          <YuksiLogo width={124} height={124} style={styles.logo} />
        </View>

        {/* White Container */}
        <View style={styles.whiteContainer}>
          {/* Header Text Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.merhabaText}>Merhaba,</Text>
              <Text style={styles.subtitleText}>Yüksi'ye hoş geldin.</Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* E-mail Input Group */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="E-mail adresinizi girin"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Şifre Input Group */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Şifrenizi girin"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => signIn()}>
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Hesabın yok mu?{' '}
                <Text
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Register')}>
                  Kayıt ol
                </Text>
              </Text>
            </View>
          </View>

          {/* Campaign Section */}
          <View style={styles.campaignSection}>
            <Text style={styles.campaignText}>
              Moto kurye kampanyasını{'\n'}kaçırma!
            </Text>
          </View>
        </View>

        {/* Animated Motor Image */}
        <Animated.View
          style={[
            styles.motorImageContainer,
            {
              transform: [{translateX: motorAnimation}],
            },
          ]}>
          <Image
            source={require('../../assets/images/motor-side.png')}
            style={styles.motorImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5B04',
  },
  mainContainer: {
    flex: 1,
  },
  orangeSection: {
    height: '20%',
    backgroundColor: '#FF5B04',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: -20,
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 28,
  },
  headerSection: {
    marginBottom: 30,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: -45,
  },
  merhabaText: {
    fontFamily: 'Urbanist',
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  subtitleText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 19,
    marginLeft: 8,
  },
  formSection: {
    paddingHorizontal: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    marginLeft: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFEFE6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Urbanist',
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#FF5B04',
    borderRadius: 39,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 17,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  loginButtonText: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 29,
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 28,
    borderBottomWidth: 1,
    marginHorizontal: 50,
    borderBottomColor: '#FF5B04',
    paddingBottom: 8,
  },
  registerText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  registerLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  campaignSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  campaignText: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '600',
    color: '#393939',
    lineHeight: 29,
    textAlign: 'center',
  },
  motorImageContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    bottom: 0,
  },
  motorImage: {
    width: 200,
    height: 200,
  },
});

export default LoginScreen;
