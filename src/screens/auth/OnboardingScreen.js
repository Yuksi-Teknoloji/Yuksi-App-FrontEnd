import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, FlatList, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/images/yuksi-loading-icon.svg';
import OnbImage1 from '../../assets/images/onboarding-card-image1.svg';
import OnbImage2 from '../../assets/images/onboarding-card-image2.svg';
import OnbImage3 from '../../assets/images/onboarding-card-image3.svg';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CARDS = [
  {
    title: 'Yük Oluştur',
    body: 'Yüksi uygulamasını açın, “Yük Oluştur”a tıklayın, taşıma için uygun aracı seçin, yükünüzün konumunu ve özelliklerini girin; sistem sizi en yakın taşıyıcıyla anında eşleştirir. Yüksi ile yükleriniz güvenle taşınır, zamandan tasarruf eder ve süreci kolayca yönetirsiniz.'
  },
  {
    title: 'Kanguru',
    body: 'Kanguru, Yüksi uygulamasında yüklerin alınacağı ve bırakılacağı yerleri detaylı konum bilgisiyle haritada gösterir, taşıyıcılara doğru ve hızlı şekilde iletilmesini sağlar. Ayrıca, hem sohbet edebilir hem de sadece sesli komut vererek yük oluşturabilirsiniz. Yani Kanguru, yük yönetimini hem hızlı hem de pratik hâle getirir.'
  },
  {
    title: 'Ticarim',
    body: 'Aracınızın fotoğrafını yükleyin, ilan detaylarını girin ve yayınlayın. İlanınız doğrudan ticari araçlarla iş yapan alıcıların ekranına düşer, böylece aracınızı hızlı ve doğru kitleye ulaştırırsınız!'
  }
];

// Carousel layout constants (center active card with peeking neighbors)
const DOT_SIZE = 10;
const CARD_HEIGHT = 640; // Figma spec
const SPACING = 12; // gap between cards
const PEEK = 32; // increased visible preview of previous/next card on each side
// Card width leaves (PEEK + spacing) space on each side when centered
const CARD_WIDTH = Math.min(340, Math.max(250, width - 2 * (PEEK + SPACING)));
// Distance between snap points (card width + defined spacing)
const ITEM_FULL_WIDTH = CARD_WIDTH + SPACING;
// Side padding centers first card while leaving equal peek areas; include half spacing to balance margins
const SIDE_PADDING = PEEK + SPACING / 2;

const OnboardingScreen = () => {
  const { signIn } = useAuth();
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Removed dynamic height measurement; we maintain constant vertical footprint

  const handlePress = (cardIndex) => {
    if (cardIndex < CARDS.length - 1) {
      listRef.current?.scrollToIndex({ index: cardIndex + 1, animated: true });
    }
    // On the last card do nothing; user must press the button
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Logo width={96} height={96} />
      </View>
      <View style={styles.carouselWithDots}>
        <Animated.FlatList
          style={styles.carouselList}
          ref={listRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          data={CARDS}
          keyExtractor={(_, i) => String(i)}
          snapToInterval={ITEM_FULL_WIDTH}
          decelerationRate="fast"
          snapToAlignment="start"
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          getItemLayout={(_, index) => ({ length: ITEM_FULL_WIDTH, offset: ITEM_FULL_WIDTH * index, index })}
          onMomentumScrollEnd={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / ITEM_FULL_WIDTH);
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            const inputRange = [ (index - 1) * ITEM_FULL_WIDTH, index * ITEM_FULL_WIDTH, (index + 1) * ITEM_FULL_WIDTH ];
            const scale = scrollX.interpolate({ inputRange, outputRange: [0.9, 1, 0.9], extrapolate: 'clamp' });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.65, 1, 0.65], extrapolate: 'clamp' });
            let Illustration = OnbImage1;
            if (index === 1) Illustration = OnbImage2;
            if (index === 2) Illustration = OnbImage3;
            const isFirst = index === 0;
            return (
              <TouchableOpacity
                activeOpacity={index === CARDS.length - 1 ? 1 : 0.85}
                disabled={index === CARDS.length - 1}
                onPress={() => handlePress(index)}
              >
                <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}> 
                  <View style={styles.illustrationCentered}>
                    <Illustration width={isFirst ? 265 : 260} height={isFirst ? 265 : 260} />
                  </View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.body}>{item.body}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Dots with fixed positioning */}
        <View style={styles.dotsDetached}>
          {CARDS.map((_, i) => {
            const inputRange = [ (i - 1) * ITEM_FULL_WIDTH, i * ITEM_FULL_WIDTH, (i + 1) * ITEM_FULL_WIDTH ];
            const dotScale = scrollX.interpolate({ inputRange, outputRange: [0.9, 1.3, 0.9], extrapolate: 'clamp' });
            const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
            return (
              <Animated.View key={i} style={[styles.dot, { transform: [{ scale: dotScale }], opacity: dotOpacity }]} />
            );
          })}
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.ctaButton, activeIndex !== CARDS.length - 1 && styles.ctaButtonHidden]}
        activeOpacity={0.9}
        disabled={activeIndex !== CARDS.length - 1}
        onPress={() => signIn()}
        pointerEvents={activeIndex !== CARDS.length - 1 ? 'none' : 'auto'}
      >
        <Text style={styles.ctaButtonText}>Başla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAF8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingBottom: 32
  },

  topContent: {
    alignItems: 'center',
    height: CARD_HEIGHT + 120 // Card height + space for logo and dots
  },

  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0
  },

  carouselSection: {
    alignItems: 'center',
    marginTop: 0
  },

  carouselList: {
    margin: 0,
    padding:0,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFF2EB',
    borderRadius: 10,
    padding: 28,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: Platform.OS === 'android' ? 12 : 0,
    alignItems: 'center',
    marginHorizontal: SPACING / 2,
    marginTop: 12,
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#FF5B04', marginBottom: 12, textAlign: 'center' },
  illustrationWrapper: { alignItems: 'center', justifyContent: 'center' },
  illustrationCentered: { width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 4 },
  body: { fontSize: 16, fontWeight: '500', color: '#333', textAlign: 'center', lineHeight: 22, marginBottom: 0 },
  dotsDetached: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 30,
    marginBottom: 20,
    zIndex: 10
  },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: '#FF5B04', marginHorizontal: 8 },
  carouselWithDots: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 24
  },
  ctaButton: {
    width: 186,
    height: 46,
    backgroundColor: '#FF5B04',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
    position: 'absolute',
    bottom: 32,
    zIndex: 20, // Ensure button is always visible
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6
  },
  ctaButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  ctaButtonHidden: { opacity: 0 },
  tapHint: { marginTop: 12, fontSize: 14, color: '#555', fontWeight: '500' }
});

export default OnboardingScreen;