import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Easing,
  PermissionsAndroid,
  Platform,
  Image,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {window} from '@/constants/sizes';
import {vehicleItems} from '@/utils/vehicleItems';
import VehicleSlideItem from '@/components/VehicleSlideItem';
import BoxIcon from '@/assets/icons/box-icon.svg';
import ProfileIcon from '@/assets/icons/profile-icon.svg';
import LocationFromIcon from '@/assets/icons/location-from.svg';
import CameraIcon from '@/assets/icons/camera-icon.svg';
import ClockIcon from '@/assets/icons/clock-icon.svg';
import ImageCropPicker from 'react-native-image-crop-picker';
import PaymentIcon from '@/assets/images/payment-icon.svg';
import LabeledInput from './components/LabeledInput';
import LocationPickerInput from './components/LocationPickerInput';
import AddressDetailFields from './components/AddressDetailFields';
import DateTimePickerField from './components/DateTimePickerField';
import NotesTextArea from './components/NotesTextArea';
import UploadImageField from './components/UploadImageField';
import CouponRow from './components/CouponRow';
import OptionSwitchRow from './components/OptionSwitchRow';
import SplitTotalRow from './components/SplitTotalRow';
import SubmitButton from './components/SubmitButton';

// Wider page width to accommodate larger vehicle icons while keeping side peek
// Transparent, outlined switch with orange borders
const OutlineSwitch = ({value, onValueChange}) => {
  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange?.(!value)}
      accessibilityRole="switch"
      accessibilityState={{checked: value}}
      style={styles.outlineSwitchTrack}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
      <Animated.View
        style={[styles.outlineSwitchThumb, {transform: [{translateX}]}]}
      />
    </TouchableOpacity>
  );
};
const PAGE_WIDTH = Math.min(
  window.width,
  Math.max(344, Math.floor(window.width * 0.8)),
);

const YukOlusturScreen = ({navigation}) => {
  const [selectedRadio, setSelectedRadio] = React.useState('1');
  // Text inputs
  const [nameValue, setNameValue] = React.useState('');
  const [fromValue, setFromValue] = React.useState('');
  const [toValue, setToValue] = React.useState('');
  // Date and time for randevulu option
  const [appointmentDate, setAppointmentDate] = React.useState(null);
  const [appointmentTime, setAppointmentTime] = React.useState(null);
  // Location data with coordinates
  const [fromLocation, setFromLocation] = React.useState(null);
  const [toLocation, setToLocation] = React.useState(null);
  // Address detail fields
  const [fromAddressDetails, setFromAddressDetails] = React.useState(null);
  const [toAddressDetails, setToAddressDetails] = React.useState(null);
  // Dropdown state
  const [openDropdown, setOpenDropdown] = React.useState(null); // 'left' | 'right' | null
  const [leftSelection, setLeftSelection] = React.useState(null);
  const [rightSelection, setRightSelection] = React.useState(null);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [pickedImageName, setPickedImageName] = React.useState('');
  const [notesValue, setNotesValue] = React.useState('');
  const [couponValue, setCouponValue] = React.useState('');
  const [couponApplying, setCouponApplying] = React.useState(false);
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponError, setCouponError] = React.useState(null);
  const [radioRowSelected, setRadioRowSelected] = React.useState(false);
  const [totalAmount, setTotalAmount] = React.useState('');
  const [activeVehicleIndex, setActiveVehicleIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const modalAnim = React.useRef(new Animated.Value(0)).current;
  // Action pill animation state
  const [pillOnRight, setPillOnRight] = React.useState(false);
  const pillSlide = React.useRef(new Animated.Value(0)).current; // 0 left, 1 right

  const togglePill = () => {
    const toValue = pillOnRight ? 0 : 1;
    Animated.timing(pillSlide, {
      toValue,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) setPillOnRight(!pillOnRight);
    });
  };

  const openModal = which => {
    setOpenDropdown(which);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setOpenDropdown(null));
  };

  const requestPhotoPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const sdk = Platform.constants?.Release
        ? parseInt(Platform.constants.Release, 10)
        : undefined;
      // Use API level via PermissionsAndroid if available
      const apiLevel = Platform.Version;
      const isTiramisuPlus =
        typeof apiLevel === 'number' ? apiLevel >= 33 : sdk ? sdk >= 13 : true;
      const perm = isTiramisuPlus
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const granted = await PermissionsAndroid.request(perm);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (e) {
      return false;
    }
  };

  const handlePickImage = async () => {
    try {
      const ok = await requestPhotoPermission();
      if (!ok) return;
      const res = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        multiple: false,
        cropping: false,
      });
      if (res && res.path) {
        setPickedImage(res);
        // Derive a display name from path if filename is not provided
        const name =
          res.filename || res.path.split('/').pop() || 'Seçilen fotoğraf';
        setPickedImageName(name);
      }
    } catch (e) {
      // Ignore user cancellation
      if (e?.code !== 'E_PICKER_CANCELLED') {
        console.warn('Image pick error', e);
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponValue?.trim()) return;
    setCouponError(null);
    setCouponApplying(true);
    try {
      // Simulate an async validation call
      await new Promise(r => setTimeout(r, 800));
      // Dummy rule: codes starting with YUK are valid
      const valid = /^YUK[A-Z0-9]{2,}$/i.test(couponValue.trim());
      if (valid) {
        setCouponApplied(true);
      } else {
        setCouponApplied(false);
        setCouponError('Geçersiz kupon kodu');
      }
    } finally {
      setCouponApplying(false);
    }
  };

  const validateAddressDetails = (details, locationName) => {
    const errors = [];
    if (!details) {
      errors.push(`${locationName} adres detayları eksik`);
      return errors;
    }
    if (!details.city?.trim())
      errors.push(`${locationName} - Şehir gerekli`);
    if (!details.district?.trim())
      errors.push(`${locationName} - İlçe gerekli`);
    if (!details.neighbourhood?.trim())
      errors.push(`${locationName} - Mahalle gerekli`);
    if (!details.street?.trim())
      errors.push(`${locationName} - Sokak/Cadde gerekli`);
    if (!details.buildingNumber?.trim())
      errors.push(`${locationName} - Bina No gerekli`);
    if (!details.floor?.trim())
      errors.push(`${locationName} - Kat gerekli`);
    if (!details.apartmentNumber?.trim())
      errors.push(`${locationName} - Daire No gerekli`);
    return errors;
  };

  const handleSubmit = async () => {
    // Basic validation
    const errors = [];
    if (!nameValue.trim()) errors.push('Ad Soyad gerekli');
    if (!fromValue.trim()) errors.push('Çıkış Konumu gerekli');
    if (!toValue.trim()) errors.push('Varış Konumu gerekli');

    // Validate address details
    errors.push(...validateAddressDetails(fromAddressDetails, 'Çıkış'));
    errors.push(...validateAddressDetails(toAddressDetails, 'Varış'));

    // Validate date/time for randevulu option
    if (selectedRadio === '2') {
      if (!appointmentDate) errors.push('Randevu tarihi gerekli');
      if (!appointmentTime) errors.push('Randevu saati gerekli');
    }

    if (!leftSelection) errors.push('Kapasite seçin');
    if (!rightSelection) errors.push('Tur seçin');
    if (!totalAmount.trim()) errors.push('Tutar girin');
    if (errors.length) {
      // For now, show the first error via console; integrate toast/snackbar later
      console.warn('Form hatası:', errors[0]);
      return false;
    }

    const payload = {
      teslimatTipi: selectedRadio === '1' ? 'hemen' : 'randevulu',
      randevuTarihi:
        selectedRadio === '2' && appointmentDate
          ? appointmentDate.toISOString()
          : null,
      randevuSaati:
        selectedRadio === '2' && appointmentTime
          ? appointmentTime.toISOString()
          : null,
      adSoyad: nameValue.trim(),
      cikis: fromValue.trim(),
      cikisKoordinat: fromLocation
        ? {
            latitude: fromLocation.latitude,
            longitude: fromLocation.longitude,
          }
        : null,
      cikisDetay: fromAddressDetails,
      varis: toValue.trim(),
      varisKoordinat: toLocation
        ? {
            latitude: toLocation.latitude,
            longitude: toLocation.longitude,
          }
        : null,
      varisDetay: toAddressDetails,
      kapasite: leftSelection?.label,
      tur: rightSelection?.label,
      resim: pickedImage?.path || null,
      notlar: notesValue?.trim() || null,
      kupon: couponApplied ? couponValue.trim() : null,
      secenek: radioRowSelected,
      toplamTutar: totalAmount.trim(),
      aracIndex: activeVehicleIndex,
    };

    setSubmitting(true);
    try {
      // TODO: integrate real API call
      await new Promise(r => setTimeout(r, 1000));
      console.log('Gönderilen payload:', payload);
      // Navigate or show success
      // navigation.navigate('Success'); // if available
    } catch (e) {
      console.warn('Gönderim hatası:', e?.message || e);
    } finally {
      setSubmitting(false);
    }
    return true;
  };
  return (
    <View style={styles.container}>
      {/* Top gradient element (big circle) */}
      <LinearGradient
        colors={['#FF5B04', '#FFFFFF']}
        locations={[0.3562, 1]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        useAngle
        angle={90}
        style={styles.topGradient}
      />

      <SafeAreaView
        style={[styles.safeArea, {paddingTop: Platform.OS === 'ios' ? 0 : 40}]}
        pointerEvents={openDropdown ? 'none' : 'auto'}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}>
          {/* Fixed header - vehicle name, stays at top */}
          <View pointerEvents="none" style={styles.fixedHeader}>
            <Text style={styles.fixedHeaderText}>
              {vehicleItems[activeVehicleIndex]?.name ?? ''}
            </Text>
          </View>

          {/* Scrollable content - carousel, pill, and forms all scroll */}
          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
          {/* Fixed ellipse base under vehicles */}
          <View pointerEvents="none" style={styles.staticEllipse} />

          {/* Carousel - scrolls with content */}
          <CarouselRN onActiveIndexChange={setActiveVehicleIndex} />

          {/* Action pill under carousel */}
          <TouchableOpacity
            style={styles.actionPillWrapper}
            activeOpacity={0.9}
            onPress={togglePill}>
            <View style={styles.actionPill}>
              <Animated.Text
                style={[
                  styles.actionPillLabel,
                  {
                    opacity: pillSlide.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                  },
                ]}>
                Yük Tarat
              </Animated.Text>
              {/* Moving circle that slides left <-> right and spins the icon */}
              <Animated.View
                style={[
                  styles.movingCircle,
                  {
                    transform: [
                      {
                        translateX: pillSlide.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 80],
                        }),
                      },
                    ],
                  },
                ]}>
                {/* Crossfade background colors to animate orange -> green while moving */}
                <Animated.View
                  style={[
                    styles.circleFill,
                    {
                      backgroundColor: '#FF5B04',
                      opacity: pillSlide.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                      }),
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.circleFill,
                    {
                      backgroundColor: '#22C55E',
                      opacity: pillSlide.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ]}
                />
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: pillSlide.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '270deg'],
                        }),
                      },
                    ],
                  }}>
                  <BoxIcon width={22} height={22} />
                </Animated.View>
              </Animated.View>
            </View>
          </TouchableOpacity>

          {/* Radio group under pill */}
          <View style={styles.radioGroupRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setSelectedRadio('1');
                setAppointmentDate(null);
                setAppointmentTime(null);
              }}
              style={styles.radioBox}>
              <View style={styles.radioItem}>
                <View style={styles.radioCircle}>
                  {selectedRadio === '1' && (
                    <View style={styles.radioInnerDot} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Hemen</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedRadio('2')}
              style={styles.radioBox}>
              <View style={styles.radioItem}>
                <View style={styles.radioCircle}>
                  {selectedRadio === '2' && (
                    <View style={styles.radioInnerDot} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Randevulu</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Date and time pickers for randevulu option */}
          {selectedRadio === '2' && (
            <View style={styles.dateTimeWrapper}>
              <DateTimePickerField
                label="Tarih Seçin"
                placeholder="GG.AA.YYYY"
                icon={ClockIcon}
                value={appointmentDate}
                onChange={setAppointmentDate}
                mode="date"
              />
              <DateTimePickerField
                label="Saat Seçin"
                placeholder="SS:DD"
                icon={ClockIcon}
                value={appointmentTime}
                onChange={setAppointmentTime}
                mode="time"
              />
            </View>
          )}

          {/* Text boxes under radio group */}
          <View style={styles.textBoxesWrapper}>
            <LabeledInput
              label="Ad Soyad"
              placeholder="Ad Soyad"
              icon={ProfileIcon}
              value={nameValue}
              onChangeText={setNameValue}
              invisibleLabel
            />
            <LocationPickerInput
              label="Çıkış Konumu"
              placeholder="Çıkış Konumu"
              icon={LocationFromIcon}
              value={fromValue}
              onLocationSelect={location => {
                setFromLocation(location);
                setFromValue(location.address);
                setFromAddressDetails(location.addressDetails || null);
              }}
            />
            {fromAddressDetails && (
              <AddressDetailFields
                addressDetails={fromAddressDetails}
                onAddressDetailsChange={setFromAddressDetails}
              />
            )}
            <LocationPickerInput
              label="Varış Konumu"
              placeholder="Varış Konumu"
              icon={LocationFromIcon}
              value={toValue}
              onLocationSelect={location => {
                setToLocation(location);
                setToValue(location.address);
                setToAddressDetails(location.addressDetails || null);
              }}
            />
            {toAddressDetails && (
              <AddressDetailFields
                addressDetails={toAddressDetails}
                onAddressDetailsChange={setToAddressDetails}
              />
            )}
          </View>

          {/* Inline dropdown triggers */}
          <View style={styles.dropdownRow}>
            <TouchableOpacity
              style={styles.dropdownTrigger}
              activeOpacity={0.8}
              onPress={() => openModal('left')}>
              <Text style={styles.dropdownTriggerText} numberOfLines={1}>
                {leftSelection?.label || 'Kapasite Seç'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownTrigger}
              activeOpacity={0.8}
              onPress={() => openModal('right')}>
              <Text style={styles.dropdownTriggerText} numberOfLines={1}>
                {rightSelection?.label || 'Tur Seç'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Upload image field (same style as dropdown) */}
          <UploadImageField
            onPress={handlePickImage}
            pickedImagePath={pickedImage?.path}
            Icon={CameraIcon}
            label={pickedImageName || 'Fotoğraf Ekleyin'}
          />

          {/* Notes textarea at the end */}
          <NotesTextArea
            label="Taleplerinizi Yazın"
            placeholder="Taleplerinizi Yazın"
            value={notesValue}
            onChangeText={setNotesValue}
          />

          {/* Coupon row */}
          <CouponRow
            value={couponValue}
            onChangeText={t => {
              setCouponValue(t);
              setCouponApplied(false);
              setCouponError(null);
            }}
            onApply={handleApplyCoupon}
            applying={couponApplying}
            applied={couponApplied}
            disabled={false}
            error={couponError}
          />

          {/* Option switch row */}
          <OptionSwitchRow
            label="Seçenek"
            value={radioRowSelected}
            onValueChange={setRadioRowSelected}
          />

          {/* Split total row */}
          <SplitTotalRow
            Icon={PaymentIcon}
            label="Toplam Tutar"
            value={totalAmount}
            onChangeText={setTotalAmount}
          />

            {/* Submit button at the bottom */}
            <SubmitButton
              title="Gönder"
              onPress={async () => {
                const ok = await handleSubmit();
                if (ok) {
                  // Navigate with autoProgress flag for 5-second auto loading
                  navigation.navigate('YukOlusturResult', {
                    startIndex: activeVehicleIndex,
                    autoProgress: true,
                  });
                }
              }}
              loading={submitting}
              disabled={false}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* Modal overlay for dropdowns */}
      {openDropdown && (
        <View
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFill, styles.modalOverlay]}>
          {/* Backdrop */}
          <Animated.View
            pointerEvents="auto"
            style={[
              StyleSheet.absoluteFill,
              styles.backdrop,
              {
                opacity: modalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.4],
                }),
              },
            ]}
            onStartShouldSetResponder={() => true}
            onResponderRelease={closeModal}
          />
          {/* Centered modal content */}
          <View style={styles.modalCenterWrap} pointerEvents="box-none">
            <Animated.View
              style={[
                styles.modalCard,
                {
                  transform: [
                    {
                      translateY: modalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                      }),
                    },
                  ],
                  opacity: modalAnim,
                },
              ]}>
              {openDropdown === 'left' ? (
                <View style={styles.leftModalContent}>
                  <Text style={styles.modalTitle}>Moto Kurye</Text>
                  {[
                    {key: '1 kg', value: 'Hafif Yük'},
                    {key: '5 kg', value: 'Ortalama Yük'},
                    {key: '10 kg', value: 'Orta Ağır Yük'},
                    {key: '20 kg', value: 'Ağır Yük'},
                  ].map((row, idx) => (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.8}
                      onPress={() => {
                        setLeftSelection({label: row.value, key: row.key});
                        closeModal();
                      }}
                      style={styles.kvRow}>
                      <View style={styles.kBox}>
                        <Text style={styles.kBoxText}>{row.key}</Text>
                      </View>
                      <View style={styles.vBox}>
                        <Text style={styles.vBoxText}>{row.value}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.rightModalContent}>
                  {['Katı', 'Sıvı', 'Isı koronumlu', 'Canlı'].map((v, idx) => {
                    const current = rightSelection?.label;
                    const isSelected = current === v;
                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.8}
                        onPress={() => {
                          setRightSelection({label: v});
                          closeModal();
                        }}
                        style={styles.radioOptionRow}>
                        <Text style={styles.modalOptionLabel}>{`${v}`}</Text>
                        <View
                          style={[
                            styles.modalRadioCircle,
                            isSelected && styles.modalRadioCircleFilled,
                          ]}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4EEF0',
    position: 'relative',
  },
  topGradient: {
    position: 'absolute',
    width: 527,
    height: 527,
    top: -207,
    left: -52,
    opacity: 1,
    borderRadius: 527 / 2,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Urbanist',
  },
  contentArea: {
    paddingTop: 10,
    minHeight: 400,
  },
  fixedHeader: {
    position: 'relative',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  fixedHeaderText: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 28,
    lineHeight: 28,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollContent: {
    // No padding needed, header is in normal flow
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: 'Urbanist',
    marginBottom: 8,
  },
  carousel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#FF5B04',
    borderRadius: 9,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 30,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Urbanist',
  },
  actionPillWrapper: {
    alignItems: 'center',
    zIndex: 1,
    width: 132,
    height: 52,
    borderRadius: 32,
    opacity: 1,
    marginTop: -100,
    marginBottom: 16,
    backgroundColor: '#F6F7FB',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  actionPill: {
    width: '100%',
    height: '100%',
    opacity: 1,
    flexDirection: 'row',
    marginLeft: 0,
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingLeft: 60, // leave space for 52px circle + 8px gap
    position: 'relative',
  },
  actionPillIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF5B04',
    borderWidth: 2,
    borderColor: '#FF5B04',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPillLabel: {
    width: 70,
    height: 19,
    fontFamily: 'Urbanist-SemiBold',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    color: '#A1A1AA',
  },
  movingCircle: {
    position: 'absolute',
    left: 0, // start flush to the left edge; travels 80px to the right via translateX
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 26,
  },
  radioGroupRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dateTimeWrapper: {
    marginTop: 12,
    gap: 12,
    alignItems: 'center',
  },
  radioBox: {
    width: 166,
    height: 56,
    minWidth: 160,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    opacity: 1,
    paddingTop: 8,
    paddingRight: 20,
    paddingBottom: 8,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadRow: {
    marginTop: 6,
    alignItems: 'center',
  },
  uploadTriggerWide: {
    width: 340,
  },
  uploadInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadThumb: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FF5B04',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5B04',
  },
  radioLabel: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#A1A1AA',
  },
  textBoxesWrapper: {
    gap: 12,
    alignItems: 'center',
  },
  labeledField: {
    width: 340,
  },
  inputLabel: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#A1A1AA',
    marginBottom: 6,
  },
  inputLabelInvisible: {
    opacity: 0,
  },
  textBox: {
    width: 340,
    height: 56,
    minWidth: 160,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    opacity: 1,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  textAreaBox: {
    width: 340,
    height: 128,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    opacity: 1,
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
  },
  textBoxInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textBoxIconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontFamily: 'Urbanist',
    fontSize: 16,
    lineHeight: 20,
    color: '#0F172A',
  },
  textAreaInput: {
    flex: 1,
    fontFamily: 'Urbanist',
    fontSize: 16,
    lineHeight: 20,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  dropdownRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dropdownTrigger: {
    width: 166,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownTriggerText: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    color: '#A1A1AA',
  },
  couponRow: {
    marginTop: 12,
    width: 340,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  inlineLabelText: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#0F172A',
  },
  textBoxInline: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    opacity: 1,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  couponButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchContainer: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineSwitchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FF5B04',
    backgroundColor: 'transparent',
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  outlineSwitchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF5B04',
    backgroundColor: 'transparent',
  },
  inlineRadioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FF5B04',
  },
  inlineRadioCircleFilled: {
    backgroundColor: '#FF5B04',
  },
  splitRowContainer: {
    marginTop: 12,
    width: 340,
    alignSelf: 'center',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  splitLabelInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  splitLabelText: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#0F172A',
  },
  splitInputInner: {
    height: 44,
    minWidth: 120,
    maxWidth: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF5B04',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  splitInputText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    lineHeight: 20,
    color: '#0F172A',
  },
  submitButton: {
    width: 344,
    height: 52,
    backgroundColor: '#FF5B04',
    borderRadius: 12,
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 16,
    paddingLeft: 20,
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  couponButtonText: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: '#FF5B04',
  },
  backdrop: {
    backgroundColor: '#000000',
  },
  modalOverlay: {
    zIndex: 9999,
    elevation: 9999,
  },
  modalCenterWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 206,
    height: 260,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    padding: 8,
    zIndex: 10000,
    elevation: 10000,
  },
  leftModalContent: {
    flex: 1,
  },
  rightModalContent: {
    flex: 1,
    paddingTop: 10,
  },
  modalTitle: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
  },
  kvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 7,
  },
  kBox: {
    width: 42,
    height: 38,
    borderRadius: 5,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vBox: {
    width: 145,
    height: 38,
    borderRadius: 5,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kBoxText: {
    fontFamily: 'Varta',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    color: '#0F172A',
  },
  vBoxText: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    color: '#0F172A',
  },
  radioOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    height: 38,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  modalOptionLabel: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    color: '#000000',
  },
  modalRadioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FF5B04',
  },
  modalRadioCircleFilled: {
    backgroundColor: '#FF5B04',
  },
  staticEllipse: {
    position: 'absolute',
    // Position roughly under the carousel; adjust with top/left as needed per design
    top: 120,
    left: 91.12,
    width: 218.88140461216418,
    height: 78.87618108615521,
    backgroundColor: '#FF5B04',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    borderRadius: 78.87618108615521 / 2,
    transform: [{rotate: '0.39deg'}],
    // Shadow approximation
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOpacity: 1,
    shadowOffset: {width: 3, height: 36},
    shadowRadius: 15.9,
    elevation: 6,
    zIndex: 0,
  },
  activeTitleOverlay: {
    position: 'absolute',
    top: 40,
    left: 137,
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    // No background per request
  },
  activeTitleText: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    height: 'fit-content',
    fontSize: 28,
    lineHeight: 28,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default YukOlusturScreen;

const CarouselRN = ({onActiveIndexChange}) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  // Blur is now applied within VehicleSlideItem only on the image area
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(0);
  const [isScrolling, setIsScrolling] = React.useState(false);

  // Keep active index in sync during scroll to pre-render neighbors and avoid settle-time hiccup
  React.useEffect(() => {
    const id = scrollX.addListener(({value}) => {
      const idx = Math.round(value / PAGE_WIDTH);
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
        onActiveIndexChange?.(idx);
      }
    });
    return () => scrollX.removeListener(id);
  }, [scrollX]);

  const renderItem = React.useCallback(
    ({item, index}) => {
      const inputRange = [
        (index - 1) * PAGE_WIDTH,
        index * PAGE_WIDTH,
        (index + 1) * PAGE_WIDTH,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.85, 0.98, 0.85],
        extrapolate: 'clamp',
      });

      const translateX = scrollX.interpolate({
        inputRange,
        outputRange: [30, 0, -30],
        extrapolate: 'clamp',
      });

      const maskOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [1, 0, 1],
        extrapolate: 'clamp',
      });

      const showBlur =
        !isScrolling &&
        index !== activeIndex &&
        Math.abs(index - activeIndex) <= 1;
      const isActive = index === activeIndex;

      return (
        <View style={{width: PAGE_WIDTH, height: 300}}>
          <Animated.View
            style={{
              flex: 1,
              borderRadius: 12,
              overflow: 'hidden',
              // Hint rasterization to reduce per-frame work
              renderToHardwareTextureAndroid: true,
              shouldRasterizeIOS: true,
              needsOffscreenAlphaCompositing: true,
              transform: [{translateX}, {scale}],
            }}>
            <VehicleSlideItem
              item={item}
              blurOpacity={maskOpacity}
              showBlur={showBlur}
              isActive={isActive}
            />
          </Animated.View>
        </View>
      );
    },
    [activeIndex],
  );

  return (
    <View style={styles.contentArea}>
      {/* Active vehicle name overlay (white text, no background) */}

      <Animated.FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={vehicleItems}
        keyExtractor={(item, idx) => String(item.id ?? idx)}
        renderItem={renderItem}
        snapToInterval={PAGE_WIDTH}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        bounces={false}
        windowSize={5}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        updateCellBatchingPeriod={16}
        getItemLayout={(_, i) => ({
          length: PAGE_WIDTH,
          offset: PAGE_WIDTH * i,
          index: i,
        })}
        contentContainerStyle={{
          paddingHorizontal: (window.width - PAGE_WIDTH) / 2,
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onMomentumScrollBegin={() => setIsScrolling(true)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        onScrollEndDrag={() => setIsScrolling(false)}
        scrollEventThrottle={16}
      />
    </View>
  );
};
