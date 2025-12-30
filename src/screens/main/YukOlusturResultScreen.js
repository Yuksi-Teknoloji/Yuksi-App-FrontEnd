import React from 'react';
import { View, ImageBackground, Image, StyleSheet, TouchableOpacity, Text, Animated, Easing, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { vehicleItems } from '@/utils/vehicleItems';
import CheckIcon from '@/assets/icons/checkmark.svg';
import MessageBubbleIcon from '@/assets/icons/message-bubble-icon.svg';
import CallIcon from '@/assets/icons/call-icon.svg';
import StarFilled from '@/assets/icons/star-filled-orange.svg';
import StarEmpty from '@/assets/icons/star-empty-orange.svg';

// Background image path
import BgImage from '@/assets/images/background-olustur-screen.jpeg';
import ProfilePhoto from '@/assets/images/profilephoto.png';
// Reuse same input components and icons as first screen
import LabeledInput from './components/LabeledInput';
import LocationPickerInput from './components/LocationPickerInput';
import NotesTextArea from './components/NotesTextArea';
import ProfileIcon from '@/assets/icons/profile-icon.svg';
import LocationFromIcon from '@/assets/icons/location-from.svg';
import PaymentIcon from '@/assets/images/payment-icon.svg';
import SplitTotalRow from './components/SplitTotalRow';
import DisplayOrderForum from './components/DisplayOrderForum';

// Unified status check component to support different colors (orange/green)
const StatusCheck = ({ color = '#0ECC00' }) => (
  <View style={[styles.checkSquare, { borderColor: color }]}>
    <CheckIcon width={40} height={40} color={color} />
  </View>
);

const YukOlusturResultScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const startIndex = typeof route?.params?.startIndex === 'number' ? route.params.startIndex : 0;
  const autoProgress = route?.params?.autoProgress === true;

  const [index, setIndex] = React.useState(startIndex);
  const [completed, setCompleted] = React.useState(false);
  const [showAvatar, setShowAvatar] = React.useState(false);
  // When true, show the avatar/info screen with an EMPTY forum container at the bottom
  const [showEmptyForum, setShowEmptyForum] = React.useState(false);
  // Forum area local state
  const [forumNoLabel, setForumNoLabel] = React.useState('');
  const [forumLabel1, setForumLabel1] = React.useState('');
  const [forumLabel2, setForumLabel2] = React.useState('');
  const [forumNotes, setForumNotes] = React.useState('');
  const [forumTotal, setForumTotal] = React.useState('');
  // Location data with coordinates
  const [forumPickupLocation, setForumPickupLocation] = React.useState(null);
  const [forumDropoffLocation, setForumDropoffLocation] = React.useState(null);
  // Button micro-animations
  const confirmAnim = React.useRef(new Animated.Value(1)).current;
  const retryAnim = React.useRef(new Animated.Value(1)).current;
  // Pending-forum buttons animations
  const yoldaAnim = React.useRef(new Animated.Value(1)).current;
  const mapAnim = React.useRef(new Animated.Value(1)).current;
  // Pending approval state to show orange bordered check screen
  const [pendingApproval, setPendingApproval] = React.useState(false);

  const animateAndNavigate = (animRef, bezierPoints, routeName) => {
    const easingFn = Easing.bezier(
      bezierPoints[0],
      bezierPoints[1],
      bezierPoints[2],
      bezierPoints[3]
    );
    Animated.sequence([
      Animated.timing(animRef, { toValue: 0.97, duration: 150, easing: easingFn, useNativeDriver: true }),
      Animated.timing(animRef, { toValue: 1, duration: 150, easing: easingFn, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        try { navigation.navigate(routeName); } catch (e) { /* noop */ }
      }
    });
  };

  const animatePress = (animRef, bezierPoints, onDone) => {
    const easingFn = Easing.bezier(
      bezierPoints[0],
      bezierPoints[1],
      bezierPoints[2],
      bezierPoints[3]
    );
    Animated.sequence([
      Animated.timing(animRef, { toValue: 0.97, duration: 150, easing: easingFn, useNativeDriver: true }),
      Animated.timing(animRef, { toValue: 1, duration: 150, easing: easingFn, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onDone?.();
    });
  };
  const springPress = (animRef, onDone) => {
    Animated.sequence([
      Animated.timing(animRef, { toValue: 0.97, duration: 120, useNativeDriver: true }),
      Animated.spring(animRef, { toValue: 1, useNativeDriver: true, mass: 1, stiffness: 100, damping: 15 }),
    ]).start(({ finished }) => { if (finished) onDone?.(); });
  };
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.9)).current;
  const intervalRef = React.useRef(null);

  // Auto-progress effect: 3 seconds loading -> 2 seconds completed
  React.useEffect(() => {
    if (!autoProgress) return;

    const timer1 = setTimeout(() => {
      setCompleted(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 3000); // Show loading for 3 seconds

    const timer2 = setTimeout(() => {
      setShowAvatar(true);
      setShowEmptyForum(false);
    }, 5000); // After 5 seconds total, show avatar screen

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [autoProgress]);

  React.useEffect(() => {
    let isMounted = true;
    const animateIn = () => {
      opacity.setValue(0);
      scale.setValue(0.9);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    };
    const animateOut = (cb) => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      ]).start(({ finished }) => finished && cb && cb());
    };

    animateIn();
    const id = setInterval(() => {
      if (!isMounted) return;
      if (completed) return;
      animateOut(() => {
        setIndex((prev) => (prev + 1) % vehicleItems.length);
        animateIn();
      });
    }, 1000);
    intervalRef.current = id;
    return () => { isMounted = false; clearInterval(id); };
  }, [opacity, scale, completed]);

  const CurrentIcon = vehicleItems[index]?.IconComponent;
  const riderName = (route?.params?.riderName ?? 'Sürücü') + '';
  const deliveriesCount = typeof route?.params?.deliveriesCount === 'number' ? route.params.deliveriesCount : 0;
  const rating = typeof route?.params?.rating === 'number' ? route.params.rating : 4.0;

  return (
    <View style={styles.container}>
      <ImageBackground source={BgImage} style={styles.bg} resizeMode="cover">
        {(!showAvatar || pendingApproval) ? (
          <View style={styles.contentWrap}>
            <View style={[styles.circle, completed && !pendingApproval && styles.circleCompleted]}>
              {!completed && CurrentIcon && (
                <Animated.View style={{ opacity, transform: [{ scale }] }}>
                  <CurrentIcon width={148} height={148} />
                </Animated.View>
              )}
              {completed && (
                <StatusCheck color={pendingApproval ? '#FF5B04' : '#0ECC00'} />
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.capsuleBtn}
              disabled={autoProgress}
              onPress={() => {
                if (autoProgress) return; // Prevent manual interaction in auto mode

                if (pendingApproval) {
                  // In pending view, allow toggling to avatar screen on press
                  setShowAvatar(true);
                  setPendingApproval(false);
                  // For the post-pending screen, the bottom forum container must be EMPTY
                  setShowEmptyForum(true);
                } else if (!completed) {
                  setCompleted(true);
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                } else {
                  setShowAvatar(true);
                  // Normal completed flow uses the original forum with inputs/buttons
                  setShowEmptyForum(false);
                }
              }}
            >
              <Text style={[
                styles.capsuleText,
                completed && !pendingApproval && styles.capsuleTextCompleted,
              ]}>
                {pendingApproval
                  ? 'Onayınız taşıyıcıya iletildi.\nTaşıyıcı onayı bekleniyor. '
                  : (completed ? 'Yüksilenme başarılı' : 'Birazdan Yüksileneceksiniz')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.completedScroll}
            contentContainerStyle={[styles.completedContainer, showEmptyForum && styles.completedContainerNoPad]}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <View style={styles.avatarWrap}>
              <Image source={ProfilePhoto} style={styles.avatarImage} resizeMode="cover" />
              {CurrentIcon && (
                <View style={styles.vehicleOverlay}>
                  <CurrentIcon width={88} height={71} />
                </View>
              )}
            </View>
            <View style={styles.nameCapsule}>
              <Text style={styles.nameCapsuleText} numberOfLines={1}>{riderName}</Text>
            </View>
            <View style={styles.infoCapsule}>
              <View style={styles.infoLeft}>
                <Image source={ProfilePhoto} style={styles.infoAvatar} resizeMode="cover" />
                <View style={styles.infoStats}>
                  <Text style={styles.infoCountText}>{deliveriesCount}</Text>
                  <Text style={styles.infoLabelText} numberOfLines={1} ellipsizeMode="tail">Tamamlanan Teslimat</Text>
                </View>
              </View>
              <View style={styles.infoActions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    // Navigate to the Messages tab/screen
                    // If nested navigation differs, adjust this route name accordingly
                    try { navigation.navigate('Messages'); } catch (e) { /* noop */ }
                  }}
                >
                  <View style={styles.actionIconWrap}>
                    <MessageBubbleIcon width={40} height={40} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    // Placeholder call action (no phone provided)
                    Alert.alert('Call', 'Call button tapped');
                  }}
                  style={{ marginLeft: 4 }}
                >
                  <View style={styles.actionIconWrap}>
                    <CallIcon width={40} height={40} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <View style={styles.starsWrap}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < Math.floor(rating);
                  const Star = filled ? StarFilled : StarEmpty;
                  return <Star key={i} width={18} height={18} />;
                })}
              </View>
              <Text style={styles.ratingNumber}>{`${Number(rating).toFixed(1)}/5`}</Text>
              <Text style={styles.ratingLabel}>Önerilen Taşıyıcı</Text>
            </View>

            {/* Forum container */
            }
            <View style={styles.forumContainer}>
              {showEmptyForum ? (
                // After clicking the pending capsule: show simple read-only text lines and two buttons
                <View style={styles.forumTextWrap}>
                  {/* Action buttons row at top */}
                  <View style={styles.forumButtonsRow}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => springPress(yoldaAnim)}
                    >
                      <Animated.View style={[styles.forumBtn, styles.forumBtnGreen, { transform: [{ scale: yoldaAnim }] }]}>
                        <Text style={styles.forumBtnText}>Yolda</Text>
                      </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => springPress(mapAnim, () => { try { navigation.navigate('carrier flow2'); } catch (e) { /* noop */ } })}
                    >
                      <Animated.View style={[styles.forumBtn, styles.forumBtnOrange, { transform: [{ scale: mapAnim }] }]}>
                        <Text style={styles.forumBtnTextSmall}>Haritada görüntüle</Text>
                      </Animated.View>
                    </TouchableOpacity>
                  </View>

                  {/* Display-only forum with icons and new-line formatting */}
                  <DisplayOrderForum
                    carrierType={forumNoLabel}
                    pickup={forumLabel1}
                    dropoff={forumLabel2}
                    note={forumNotes}
                    total={forumTotal}
                  />
                </View>
              ) : (
                <View style={styles.forumInner}>
                  {/* One text field without label */}
                  <LabeledInput
                    label=""
                    placeholder="Taşıyıcı Türü: Motorsiklet"
                    icon={ProfileIcon}
                    value={forumNoLabel}
                    onChangeText={setForumNoLabel}
                    invisibleLabel
                  />

                  {/* Two text fields with label and icon */}
                  <LocationPickerInput
                    label="Alış Noktası:"
                    placeholder="Alış Noktası"
                    icon={LocationFromIcon}
                    value={forumLabel1}
                    onLocationSelect={(location) => {
                      setForumPickupLocation(location);
                      setForumLabel1(location.address);
                    }}
                  />
                  <LocationPickerInput
                    label="Varış Noktası:"
                    placeholder="Varış Noktası"
                    icon={LocationFromIcon}
                    value={forumLabel2}
                    onLocationSelect={(location) => {
                      setForumDropoffLocation(location);
                      setForumLabel2(location.address);
                    }}
                  />

                  {/* One text area */}
                  <NotesTextArea
                    label="Taşıyıcıya Not Bırak"
                    placeholder="Örn: Paketimin sıcak gitmesi gerekiyor."
                    value={forumNotes}
                    onChangeText={setForumNotes}
                  />

                  {/* Total field same as first screen */}
                  <SplitTotalRow
                    Icon={PaymentIcon}
                    label="toplam Tutar"
                    value={forumTotal}
                    onChangeText={setForumTotal}
                  />

                  {/* Bottom stacked action buttons */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      animatePress(confirmAnim, [0.45, 1.45, 0.8, 1], () => {
                        // Switch to pending approval screen
                        setPendingApproval(true);
                        setShowAvatar(false);
                        setCompleted(true);
                        if (intervalRef.current) {
                          clearInterval(intervalRef.current);
                          intervalRef.current = null;
                        }
                      })
                    }
                  >
                    <Animated.View style={[styles.ctaBtn, styles.ctaBtnPrimary, { transform: [{ scale: confirmAnim }] }]}>
                      <Text style={styles.ctaBtnText}>Onayla</Text>
                    </Animated.View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => animateAndNavigate(retryAnim, [0.3, -0.05, 0.7, -0.5], 'stay1')}
                  >
                    <Animated.View style={[styles.ctaBtn, styles.ctaBtnSecondary, { transform: [{ scale: retryAnim }] }]}>
                      <Text style={styles.ctaBtnText}>Yeniden Yüksile</Text>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1 },
  contentWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 220, // lifted circle so vehicle appears centered within it
  },
  circle: {
    width: 161,
    height: 161,
    borderRadius: 161 / 2,
    opacity: 1,
    borderWidth: 3,
    backgroundColor: '#F6F7FB',
    borderColor: '#FF5B04',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  circleCompleted: {
    borderColor: '#0ECC00',
  },
  checkSquare: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#FF5B04',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSquareCompleted: {
    borderColor: '#0ECC00',
  },
  capsuleBtn: {
    width: 275,
    height: 64,
    borderRadius: 32,
    marginTop: 40,
    backgroundColor: '#F6F7FB',
    borderWidth: 1,
    borderColor: '#F6F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleText: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 18,
    letterSpacing: 0,
    color: '#9797A0',
    textAlign: 'center',
  },
  capsuleTextCompleted: { color: '#0ECC00' },
  completedScroll: { flex: 1 },
  completedContainer: {
    alignItems: 'center',
    paddingTop: 99,
    paddingBottom: 32,
  },
  completedContainerNoPad: {
    paddingBottom: 0,
  },
  avatarWrap: {
    width: 151,
    height: 151,
    opacity: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#E0E0E0',
    transform: [{ rotate: '0deg' }],
    opacity: 1,
  },
  vehicleOverlay: {
    position: 'absolute', // minimal absolute to overlap within avatar
    width: 88,
    height: 71,
    right: -14,
    bottom: -26,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameCapsule: {
    marginTop: 28,
    width: 178,
    height: 36,
    borderRadius: 39,
    opacity: 1,
    backgroundColor: 'rgba(254,254,254,0.54)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    transform: [{ rotate: '0deg' }],
  },
  nameCapsuleText: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: 0,
    color: '#666666',
  },
  infoCapsule: {
    marginTop: 46,
    width: 393,
    height: 64,
    borderRadius: 39,
    opacity: 1,
    backgroundColor: 'rgba(254,254,254,0.54)',
    transform: [{ rotate: '0deg' }],
    // Shadow approximation
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 1 },
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  infoAvatar: {
    width: 58,
    height: 58,
    borderRadius: 33.5,
    borderWidth: 2,
    borderColor: '#FF5B04',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  infoLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    flexShrink: 1,
    minWidth: 0,
  },
  infoCountText: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: 0,
    color: '#666666',
    marginRight: 8,
  },
  infoLabelText: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    color: '#666666',
    flexShrink: 1,
  },
  infoSpacer: { flex: 1 },
  infoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconWrap: {
    width: 52,
    height: 52,
    borderWidth: 0,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  ratingRow: {
    width: 393,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingLeft: 8, // align stars with capsule's inner padding
  },
  starsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingNumber: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    color: '#FF5B04',
    marginRight: 8,
  },
  ratingLabel: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    color: '#FF5B04',
  },

  // Container for forum area under the rating section
  forumContainer: {
    marginTop: 24,
    marginBottom: -100, // Extend beyond viewport to cover background
    width: '100%',
    opacity: 1,
    backgroundColor: '#E4EEF0',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignSelf: 'center',
    transform: [{ rotate: '0deg' }],
    paddingBottom: 100,
  },
  forumInner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  forumTextWrap: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    gap: 8,
  },
  forumButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  forumBtn: {
    width: 166,
    height: 52,
    borderRadius: 12,
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 16,
    paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forumBtnGreen: {
    backgroundColor: '#0ECC00',
  },
  forumBtnOrange: {
    backgroundColor: '#FF5B04',
  },
  forumBtnText: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  forumBtnTextSmall: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  forumTextLine: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    lineHeight: 22,
    color: '#0F172A',
  },
  ctaBtn: {
    width: 344,
    height: 52,
    borderRadius: 12,
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 16,
    paddingLeft: 20,
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnPrimary: {
    backgroundColor: '#FF5B04',
  },
  ctaBtnSecondary: {
    backgroundColor: '#FF0404',
  },
  ctaBtnText: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default YukOlusturResultScreen;
