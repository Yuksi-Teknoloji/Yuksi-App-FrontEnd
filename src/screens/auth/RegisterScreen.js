import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import YuksiLogo from '../../assets/images/yuksi-vektor-logo.svg';
import {Checkbox} from 'expo-checkbox';
import {useAuth} from '../../context/AuthContext';
import { useAuthStore } from '../../store/authStore';
import PhoneInput from 'react-native-phone-number-input';

const RegisterScreen = ({navigation}) => {
  const {signUp} = useAuth();
  const registering = useAuthStore(state => state.registering);
  const registerError = useAuthStore(state => state.registerError);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('TR');

  const handleRegister = () => {
    const payload = {
      email: email.trim(),
      password,
      phone: phoneNumber, // Consider formatting to E.164 if needed
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    };
    signUp({ navigation, data: payload });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5B04" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
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
            {/* Name/Surname Input Group */}
            <View style={styles.nameInputContainer}>
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>İsim</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="İsim giriniz"
                    placeholderTextColor="#999"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>Soy İsim</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Soy İsim giriniz"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>

            {/* Phone Number Input Group */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon Numarası</Text>
              <View style={styles.phoneInputContainer}>
                <PhoneInput
                  ref={null}
                  defaultValue={phoneNumber}
                  defaultCode={countryCode}
                  layout="second"
                  onChangeText={text => {
                    setPhoneNumber(text);
                  }}
                  onChangeCountry={country => {
                    setCountryCode(country.cca2);
                  }}
                  withShadow={false}
                  autoFocus={false}
                  containerStyle={styles.phoneInputContainerStyle}
                  textContainerStyle={styles.phoneInputTextContainer}
                  textInputStyle={styles.phoneInputText}
                  codeTextStyle={styles.phoneInputCodeText}
                  flagButtonStyle={styles.phoneInputFlagButton}
                  countryPickerButtonStyle={styles.phoneInputCountryPicker}
                  placeholder="Telefon Numarası giriniz"
                />
              </View>
            </View>

            {/* E-mail Input Group */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="E-mail adresinizi girin"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
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
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* Read User Agreement */}
            <View style={styles.readUserAgreement}>
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color="#FF5B04"
              />
              <Text style={styles.readUserAgreementText}>
                Kullanıcı Sözleşmesini okudum, onaylıyorum.
              </Text>
            </View>

            {/* Register Button */}
            {registerError ? (
              <Text style={styles.errorText}>{registerError}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.registerButton, registering && { opacity: 0.6 }]}
              disabled={registering}
              onPress={handleRegister}>
              <Text style={styles.registerButtonText}>{registering ? 'Kaydediliyor…' : 'Kayıt Ol'}</Text>
            </TouchableOpacity>

                {/* Have an account */}
                <View style={styles.registerContainer}>
                  <Text
                    style={styles.registerText}
                    onPress={() => navigation.navigate('Login')}>
                    Mevcut bir hesabım var
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5B04',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
  },
  readUserAgreement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  readUserAgreementText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 12,
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
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
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
  flex1: {
    flex: 1,
  },
  phoneInputContainer: {
    backgroundColor: '#FFEFE6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  phoneInputContainerStyle: {
    backgroundColor: 'transparent',
    marginLeft: 8,
    width: '100%',
  },
  phoneInputTextContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  phoneInputText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
  },
  phoneInputCodeText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
  },
  phoneInputFlagButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInputCountryPicker: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
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
  registerButtonText: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 29,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
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

export default RegisterScreen;
