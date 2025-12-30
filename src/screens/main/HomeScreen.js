import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {useAuth} from '@/context/AuthContext';

import NotificationIcon from '../../assets/icons/notification-icon.svg';
import KangorooIcon from '../../assets/images/kangoroo-icon.svg';
import LoadIcon from '../../assets/images/load-icon.svg';

import MotorcycleSvg from '../../assets/images/motorcycle.svg';
import MinivanSvg from '../../assets/images/minivan.svg';
import PanelvanSvg from '../../assets/images/panelvan.svg';
import TruckSvg from '../../assets/images/truck.svg';
import PickupTruckSvg from '../../assets/images/pickup-truck.svg';
import ProfileIcon from '@/assets/icons/profile-icon.svg';

import VehicleInfoCard from '../../components/VehicleInfoCard';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const {signOut} = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState('Moto Kurye');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState(null);

  const handleVehicleSelect = vehicle => {
    setSelectedVehicle(vehicle.title);
    setSelectedVehicleInfo(vehicle);
    setModalVisible(true);
  };

  const vehicleTypes = [
    {
      title: 'Moto Kurye',
      image: MotorcycleSvg,
      description:
        'Moto kuryeler genelde 40–50 kg’a kadar yük taşıyabilir. Ama ister  sadece bir zarf olsun, ister market poşeti ya da paket yemek, hepsi güvenle teslim edilir. Yemek siparişinden alışveriş ürünlerine, ilaçtan belgeye kadar pek çok şeyi hızlıca ulaştırmak için moto kuryeler şehirde en pratik çözümdür.',
    },
    {
      title: 'Minivan',
      image: MinivanSvg,
      description:
        'Minivanlar genelde 500–800 kg’a kadar yük taşıyabilir. İster birkaç koli, ister küçük ev eşyaları ya da toplu alışveriş ürünleri olsun, hepsi rahatlıkla sığar. Taşınmadan ofis ihtiyaçlarına, market teslimatından küçük nakliyeye kadar minivanlar şehir içi pratik ve güvenli çözümler sunar.',
    },
    {
      title: 'Panelvan',
      image: PanelvanSvg,
      description:
        'Panelvanlar genelde 1.000–1.500 kg’a kadar yük taşıyabilir. İster büyük koliler, ister mobilya ya da toplu sipariş ürünleri olsun, geniş hacimleriyle hepsi kolayca taşınır. Ev taşımadan mağaza sevkiyatına, e-ticaret teslimatından profesyonel nakliyeye kadar panelvanlar güvenli ve güçlü bir çözümdür. ',
    },
    {
      title: 'Kamyonet',
      image: PickupTruckSvg,
      description:
        'Kamyonetler genelde 1.500–3.500 kg’a kadar yük taşıyabilir. İster inşaat malzemesi, ister büyük mobilyalar ya da toplu ticari ürünler olsun, güçlü yapıları sayesinde kolayca taşınır. Nakliyeden ticari sevkiyata, pazar ve mağaza teslimatından tarım ürünlerine kadar kamyonetler hem şehir içi hem de şehirler arası güvenilir çözümler sunar.',
    },
    {
      title: 'Kamyon',
      image: TruckSvg,
      description:
        'Kamyonlar genelde 3.500 kg’dan başlayıp 20.000 kg’a kadar yük taşıyabilir. İster ağır makineler, ister büyük hacimli eşyalar ya da toplu ticari ürünler olsun, geniş kasa ve güçlü motorları sayesinde rahatça taşınır. Şehirler arası taşımacılıktan lojistik sevkiyata, inşaat malzemelerinden endüstriyel ürünlere kadar kamyonlar güvenli ve yüksek kapasiteli çözümler sunar.',
    },
  ];

  const bannerData = [
    {
      id: 1,
      image: require('../../assets/images/yuksi-banner.png'),
      title: 'Yüksi Platformu',
    },
    {
      id: 2,
      image: require('../../assets/images/background-motor.png'),
      title: 'Hızlı Teslimat',
    },
    {
      id: 3,
      image: require('../../assets/images/background-motor.png'),
      title: 'Güvenli Taşıma',
    },
  ];

  const adsData = [
    {
      id: 1,
      image: require('@/assets/images/background-motor.png'),
      title: 'Sahibinden ağır tonaj kamyonet hatasız boyasız hasar kayıtsız.',
      location: 'Bursa/Kestel',
      price: '2.500.000 TL',
    },
    {
      id: 2,
      image: require('@/assets/images/background-motor.png'),
      title: 'Her yüke gider değişensiz geniş kasa panelvan.',
      location: 'Bursa/Kestel',
      price: '2.700.000TL',
    },
    {
      id: 3,
      image: require('@/assets/images/background-motor.png'),
      title: 'Kebapçıdan satılık taşıma boxlı kilometresi düşük motor',
      location: 'Bursa/Kestel',
      price: '100.000.TL',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.profilePhoto}>
              <ProfileIcon width={22} height={22} />
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hoşgeldin,</Text>
              <Text style={styles.userName}>Rıdvan Berat Çalış</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Post')}>
            <NotificationIcon width={24} height={24} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Vehicle Type Selector */}
        <View style={styles.vehicleSelector}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehicleSelectorContent}>
            {vehicleTypes.map((vehicle, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.vehicleButton,
                  selectedVehicle === vehicle.title &&
                    styles.vehicleButtonActive,
                ]}
                onPress={() => handleVehicleSelect(vehicle)}>
                <Text
                  style={[
                    styles.vehicleText,
                    selectedVehicle === vehicle.title &&
                      styles.vehicleTextActive,
                  ]}>
                  {vehicle.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Banner Slider */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerSlider}>
          {bannerData.map(banner => (
            <View key={banner.id} style={styles.bannerCard}>
              <Image source={banner.image} style={styles.bannerImage} />
            </View>
          ))}
        </ScrollView>

        {/* Slider Indicators */}
        <View style={styles.sliderIndicators}>
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('VehicleCategory')}>
            <Text style={styles.actionButtonText}>Ticarim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonGroup}
            onPress={() => navigation.navigate('YukOlustur')}>
            <LoadIcon width={16} height={20} />
            <Text style={styles.orangeActionButtonText}>Yük Oluştur</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonGroup}
            onPress={() => navigation.navigate('KanguruChat')}>
            <KangorooIcon width={24} height={24} />
            <Text style={styles.orangeActionButtonText}>Kanguru</Text>
          </TouchableOpacity>
        </View>

        {/* İlanlar Section */}
        <Text style={styles.sectionTitle}>İlanlar</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.adsSlider}>
          {adsData.map(ad => (
            <View key={ad.id} style={styles.adCard}>
              <Image source={ad.image} style={styles.adImage} />
              <View style={styles.adInfo}>
                <Text style={styles.adTitle}>{ad.title}</Text>
                <View style={styles.adBottom}>
                  <Text style={styles.adLocation}>{ad.location}</Text>
                  <Text style={styles.adPrice}>{ad.price}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Development Logout Button */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.devLogoutButton}
            onPress={() => signOut()}>
            <Text style={styles.devLogoutButtonText}>🚪 DEV: Çıkış Yap</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Vehicle Info Modal */}
      {selectedVehicleInfo && (
        <VehicleInfoCard
          title={selectedVehicleInfo.title}
          image={selectedVehicleInfo.image}
          description={selectedVehicleInfo.description}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FC',
  },
  // Header Section
  header: {
    backgroundColor: '#FF5B04',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingContainer: {
    justifyContent: 'center',
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  greeting: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 29,
  },
  userName: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 19,
    marginLeft: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontFamily: 'Prompt',
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5B04',
    lineHeight: 18,
  },
  // Main Content
  mainContent: {
    flex: 1,
    backgroundColor: '#F5F6FC',
    paddingTop: 20,
  },
  // Vehicle Selector
  vehicleSelector: {
    paddingHorizontal: 27,
    marginBottom: 30,
  },
  vehicleSelectorContent: {},
  vehicleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF5B04',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginRight: 8,
    minWidth: 65.57,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleButtonActive: {
    backgroundColor: '#FF5B04',
  },
  vehicleText: {
    fontFamily: 'Urbanist',
    fontSize: 10,
    fontWeight: '600',
    color: '#FF5B04',
    lineHeight: 12,
  },
  vehicleTextActive: {
    color: '#FFFFFF',
  },
  // Banner Slider
  bannerSlider: {
    height: 164,
    marginBottom: 12,
  },
  bannerCard: {
    width: width - 32,
    height: 164,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 26.6,
    elevation: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  // Slider Indicators
  sliderIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFAF85',
    marginHorizontal: 3,
  },
  indicatorActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5B04',
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#FF5B04',
    borderRadius: 9,
    justifyContent: 'center',
    padding: 25,
    alignItems: 'center',
  },
  actionButtonGroup: {
    backgroundColor: '#FF5B04',
    borderRadius: 9,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionButtonText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orangeActionButtonText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  // İlanlar Section
  sectionTitle: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '600',
    color: '#393939',
    lineHeight: 29,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  adsSlider: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  adCard: {
    width: 173,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: 141,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  adInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  adTitle: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '700',
    color: '#393939',
    lineHeight: 14.4,
    marginBottom: 8,
  },
  adBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adLocation: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '500',
    color: '#393939',
    lineHeight: 14.4,
  },
  adPrice: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '600',
    color: '#0ECC00',
    lineHeight: 14.4,
  },
  // Development Logout Button Styles
  devLogoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF5252',
    borderStyle: 'dashed',
  },
  devLogoutButtonText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomeScreen;
