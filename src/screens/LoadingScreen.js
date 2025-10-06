import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import YuksiLoadingIcon from '../assets/images/yuksi-loading-icon.svg';
import LinearGradient from 'react-native-linear-gradient';


const {width, height} = Dimensions.get('window');
const motorImage = require('../assets/images/background-motor-original.png');
// Delay before starting the pop animation (in ms). Increased to start a bit later.
const ANIMATION_START_DELAY = 1300; // was 800

const LoadingScreen = ({ navigation }) => {
  const [showImage, setShowImage] = useState(false);
  const scale = useState(new Animated.Value(1))[0];
  const translateY = useRef(new Animated.Value(0)).current; // vertical lift to login position
  const [logoMoved, setLogoMoved] = useState(false);
  // Refs controlling phase 2 timing (must be declared at component level, not inside useEffect)
  const secondPhaseTimeoutRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);
  const phase2StartedRef = useRef(false);

  // Target scale to match LoginScreen logo size (login uses 124px vs loading 148px base)
  const FINAL_SCALE = 124 / 148; // ≈0.838
  // Compute final translate so logo finishes at (near) top of screen (top-aligned center horizontally)
  // Start center Y (current placement): height/2 - (initialHeight/2)
  const initialLogoHeight = 148;
  const startCenterY = height / 2 - initialLogoHeight / 2;
  const finalDisplayedHeight = 124; // after scaling
  const LOGIN_LOGO_TOP_OFFSET = -20; // desired final top offset (same as top:-20 on LoginScreen)
  // We want: finalTop = -20
  // finalTop = (height/2 - finalDisplayedHeight/2) + TARGET_TRANSLATE_Y
  // => TARGET_TRANSLATE_Y = desiredTop - (height/2 - finalDisplayedHeight/2)
  const TARGET_TRANSLATE_Y = LOGIN_LOGO_TOP_OFFSET - (height / 2 - finalDisplayedHeight / 2);

  useEffect(() => {
    const SECOND_PHASE_DELAY = 700; // ms after phase 1 finishes
    const FALLBACK_PHASE2_MAX_WAIT = 1400; // safety fallback (after phase1) to ensure phase2 starts

    const startPhase2 = () => {
      if (phase2StartedRef.current) return;
      phase2StartedRef.current = true;
      if (secondPhaseTimeoutRef.current) clearTimeout(secondPhaseTimeoutRef.current);
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
      Animated.parallel([
        Animated.timing(scale, {
          toValue: FINAL_SCALE,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: TARGET_TRANSLATE_Y,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
  setTimeout(() => {
    setLogoMoved(true);
    navigation?.replace && navigation.replace('Login');
  }, 0);
      });
    };

    const imageTimer = setTimeout(() => {
      // Phase 1: Enlarge logo (pop)
      Animated.spring(scale, {
        toValue: 346 / 148,
        mass: 1,
        stiffness: 202,
        damping: 17.3,
        useNativeDriver: true,
      }).start(() => {
        setShowImage(true);
        // Schedule normal phase 2 start
        secondPhaseTimeoutRef.current = setTimeout(() => {
          // Use RAF so layout pass after image swap completes
          requestAnimationFrame(startPhase2);
        }, SECOND_PHASE_DELAY);
        // Fallback: if for any reason not started, force it later
        fallbackTimeoutRef.current = setTimeout(startPhase2, FALLBACK_PHASE2_MAX_WAIT);
      });
    }, ANIMATION_START_DELAY);

    return () => {
      clearTimeout(imageTimer);
      if (secondPhaseTimeoutRef.current) clearTimeout(secondPhaseTimeoutRef.current);
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    };
  }, [scale, translateY, navigation]);

  const renderGradientBackground = () => (
    <ImageBackground
      source={motorImage}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageImage}
      resizeMode="cover">
      {/* Base vertical gradient */}
      <LinearGradient
        colors={[ '#FF5B04', '#FFFFFF', '#FF5B04' ]}
        locations={[0, 0.5112, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Subtle tint overlay (second gradient from Figma spec) */}
      <LinearGradient
        colors={['rgba(255,91,4,0.2)', 'rgba(255,91,4,0.2)']}
        locations={[0, 0.3904]}
        style={StyleSheet.absoluteFill}
      />
    </ImageBackground>
  );

//   const renderGradientBackground = () => (
// <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
//   <Text style={styles.linearGradient}>
//     Sign in with Facebook
//   </Text>
// </LinearGradient>
//   );

  

const renderImageBackground = () => (
  <ImageBackground
    source={motorImage}
    style={styles.backgroundImage}
    imageStyle={styles.backgroundImageImageStrong}
    resizeMode="cover"
  >
    {/* Adjusted gradient: lowered mid transparency so underlying image shows more */}
    <LinearGradient
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      colors={[
        'rgba(255,191,166,0.72)', // slightly less opaque edge to reveal texture
        'rgba(255,205,182,0.48)',
        'rgba(255,218,200,0.30)',
        'rgba(255,230,214,0.18)',
        'rgba(255,240,228,0.10)',
        'rgba(255,245,238,0.04)',
        'rgba(255,240,228,0.10)',
        'rgba(255,230,214,0.18)',
        'rgba(255,218,200,0.30)',
        'rgba(255,205,182,0.48)',
        'rgba(255,191,166,0.72)',
      ]}
      locations={[0, 0.10, 0.25, 0.38, 0.46, 0.50, 0.54, 0.62, 0.75, 0.90, 1]}
      style={StyleSheet.absoluteFill}
    />
  </ImageBackground>
);
  return (
    <View style={styles.container}>
      {showImage ? renderImageBackground() : renderGradientBackground()}
      <Animated.View style={{
        transform: [
          {scale},
          {translateY}
        ]
      }}>
        <YuksiLoadingIcon width={148} height={148} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backgroundImageImage: {
    opacity: 0.5,
  },
  backgroundImageImageStrong: {
    opacity: 0.85,
  },
});

export default LoadingScreen;