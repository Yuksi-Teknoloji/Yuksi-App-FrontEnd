import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
    // Image,
} from 'react-native';
import LocationIcon from '../../assets/icons/location-from.svg';
import GreenLocationIcon from '../../assets/icons/location-icon.svg';
import ClockIcon from '../../assets/icons/clock-icon.svg';
import CallIcon from '../../assets/icons/call-icon.svg';
import MessageIcon from '../../assets/icons/message-bubble-icon.svg';
import CheckIcon from '../../assets/icons/check-success.svg';
import ArrowRightIcon from '../../assets/icons/arrow-right.svg';
import DateIcon from '../../assets/icons/date-icon.svg';
import ProfileIcon from '@/assets/icons/profile-icon.svg';

// Vehicle SVGs
import MotorcycleSvg from '../../assets/images/motorcycle.svg';
import TruckSvg from '../../assets/images/truck.svg';
import MinivanSvg from '../../assets/images/minivan.svg';

// Sample data for transfers
const transfersData = [
  {
    id: 1,
    type: 'hemen',
    status: 'yolda',
    courierName: 'Kağan İbrahim Çalış',
    courierRating: '5/4',
    vehicleType: 'Moto Kurye',
    vehicleSvg: MotorcycleSvg,
    from: 'KESTEL Ahmet Vefikpaşa OSB Mahallesi, Bursa Caddesi No:73, Kestel/Bursa.',
    to: 'Gözede, 16450 Kestel/Bursa',
    dateTime: '12.00',
  totalAmount: '580 TL',
  },
  {
    id: 2,
    type: 'randevulu',
    status: 'bekliyor',
    courierName: 'Kağan İbrahim Çalış',
    courierRating: '5/4',
    vehicleType: 'Kamyon',
    vehicleSvg: TruckSvg,
    from: 'KESTEL Ahmet Vefikpaşa OSB Mahallesi, Bursa Caddesi No:73, Kestel/Bursa.',
    to: 'Gözede, 16450 Kestel/Bursa',
    dateTime: '12.00/5 eylül/2025',
    totalAmount: '2850 TL',
  // courier image replaced by profile SVG icon
  },
  {
    id: 3,
    type: 'randevulu',
    status: 'tamamlandı',
    courierName: 'Kağan İbrahim Çalış',
    courierRating: '5/4',
    vehicleType: 'Minivan',
    vehicleSvg: MinivanSvg,
    from: 'KESTEL Ahmet Vefikpaşa OSB Mahallesi, Bursa Caddesi No:73, Kestel/Bursa.',
    to: 'Gözede, 16450 Kestel/Bursa',
    dateTime: '12.00/5 eylül/2025',
  totalAmount: '1850 TL',
  },
];

const PostsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('tümü');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('bugün');

  const filterOptions = [
    {key: 'tümü', label: 'Tümü'},
    {key: 'hemen', label: 'Hemen'},
    {key: 'randevulu', label: 'Randevulu'},
    {key: 'tamamlandı', label: 'Tamamlandı'},
  ];

  const timeFilterOptions = [
    {key: 'bugün', label: 'Bugün'},
    {key: 'bu-hafta', label: 'Bu hafta'},
    {key: 'bu-ay', label: 'Bu ay'},
  ];

  const filteredTransfers = transfersData.filter(transfer => {
    if (selectedFilter === 'tümü') return true;
    if (selectedFilter === 'tamamlandı')
      return transfer.status === 'tamamlandı';
    return transfer.type === selectedFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>İşlemlerim</Text>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}>
            {filterOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterTab,
                  selectedFilter === option.key && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(option.key)}>
                <Text
                  style={[
                    styles.filterTabText,
                    selectedFilter === option.key && styles.filterTabTextActive,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Time Filter Tabs */}
      <View style={styles.timeFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeFilterScrollContent}>
          {timeFilterOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setSelectedTimeFilter(option.key)}>
              <Text
                style={[
                  styles.timeFilterText,
                  selectedTimeFilter === option.key &&
                    styles.timeFilterTextActive,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transfers List */}
      <ScrollView
        style={styles.transfersList}
        showsVerticalScrollIndicator={false}>
        {filteredTransfers.map(transfer => (
          <TransferCard key={transfer.id} transfer={transfer} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const TransferCard = ({transfer}) => {
  const getStatusColor = status => {
    switch (status) {
      case 'yolda':
        return '#0ECC00';
      case 'bekliyor':
        return '#707070';
      case 'tamamlandı':
        return '#FF5B04';
      default:
        return '#707070';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'yolda':
        return 'Yolda';
      case 'bekliyor':
        return 'Bekliyor';
      case 'tamamlandı':
        return 'Tamamlandı';
      default:
        return status;
    }
  };

  const VehicleSvg = transfer.vehicleSvg;

  const renderActionButtons = () => {
    switch (transfer.status) {
      case 'yolda':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButtonPlain}>
              <GreenLocationIcon width={25} height={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonPlain}>
              <CallIcon width={25} height={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonPlain}>
              <MessageIcon width={25} height={25} />
            </TouchableOpacity>
          </View>
        );
      case 'bekliyor':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButtonPlain}>
              <CallIcon width={25} height={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonPlain}>
              <MessageIcon width={25} height={25} />
            </TouchableOpacity>
          </View>
        );
      case 'tamamlandı':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButtonPlain}>
              <CheckIcon width={25} height={25} />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Section - Courier Info + Transfer Type + Actions */}
      <View style={styles.topSection}>
        {/* Left - Courier Info */}
        <View style={styles.courierSection}>
          <View style={styles.courierImage}>
            <ProfileIcon width={22} height={22} />
          </View>
          <View style={styles.courierTextInfo}>
            <Text style={styles.courierName}>{transfer.courierName}</Text>
            <Text style={styles.courierRating}>{transfer.courierRating}</Text>
          </View>
        </View>

        {/* Center - Transfer Type */}
        <View style={styles.transferTypeSection}>
          <Text style={styles.transferType}>
            {transfer.type === 'hemen' ? 'Hemen' : 'Randevulu'}
          </Text>
          <ArrowRightIcon width={12} height={12} />
        </View>

        {/* Right - Action Buttons */}
        {renderActionButtons()}
      </View>

      {/* Main Content Section */}
      <View style={styles.mainContent}>
        {/* Left - Vehicle Image */}
        <View style={styles.vehicleSection}>
          <VehicleSvg width={120} height={80} />
        </View>

        {/* Right - Location Details + Status */}
        <View style={styles.detailsSection}>
          <Text style={styles.vehicleType}>{transfer.vehicleType}</Text>

          {/* Location Info */}
          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <LocationIcon width={11} height={15} />
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Nereden</Text>
                <Text style={styles.locationText}>{transfer.from}</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <LocationIcon width={11} height={15} />
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Nereye</Text>
                <Text style={styles.locationText}>{transfer.to}</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              {transfer.type === 'hemen' ? (
                <ClockIcon width={11} height={15} />
              ) : (
                <DateIcon width={11} height={15} />
              )}
              <View style={styles.locationRow2}>
                <View style={styles.locationRow2Left}>
                  <Text style={styles.locationLabel}>
                    {transfer.type === 'hemen' ? 'Saat' : 'Tarih'}
                  </Text>
                  <Text style={styles.locationText}>{transfer.dateTime}</Text>
                </View>
                {/* Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(transfer.status)},
                  ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(transfer.status)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom - Total Amount */}
      <View style={styles.totalAmount}>
        <Text style={styles.totalAmountText}>
          Toplam Tutar: {transfer.totalAmount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF5B04',
    fontFamily: 'Urbanist',
  },
  notificationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeFilterContainer: {
    padding: 20,
  },
  timeFilterScrollContent: {
    flexDirection: 'row',
    gap: 30,
  },
  timeFilterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'Urbanist',
  },
  timeFilterTextActive: {
    color: '#FF5B04',
  },
  filterContainer: {
    paddingVertical: 15,
  },
  filterScrollContent: {
    paddingLeft: 20,
    paddingRight: 100, // sondaki buton tam gözüksün
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    marginRight: 10,
    borderRadius: 39,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF5B04',
  },
  filterTabActive: {
    backgroundColor: '#FF5B04',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5B04',
    fontFamily: 'Urbanist',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  transfersList: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 10,
    backgroundColor: '#F5F6FC',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  // New Layout Styles
  topSection: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courierSection: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F4',
    paddingRight: 10,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
  },
  courierImage: {
    width: 32,
    height: 32,
    borderWidth: 1.5,
    borderColor: '#FF5B04',
    borderRadius: 16,
    marginRight: 8,
    overflow: 'hidden',
  },
  courierImageReal: {
    width: '100%',
    height: '100%',
  },
  courierTextInfo: {
    justifyContent: 'center',
  },
  courierName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    fontFamily: 'Urbanist',
  },
  courierRating: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF5B04',
    fontFamily: 'Urbanist',
  },
  transferTypeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  transferType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5B04',
    fontFamily: 'Urbanist',
    marginRight: 5,
  },
  arrowIcon: {
    fontSize: 12,
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonPlain: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  vehicleSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
    backgroundColor: '#FFF8F4',
    borderRadius: 15,
    marginRight: 10,
  },
  detailsSection: {
    flex: 2,
    paddingLeft: 10,
  },
  vehicleType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    fontFamily: 'Urbanist',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 39,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Urbanist',
  },
  locationInfo: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationDetails: {
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRow2Left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRow2: {
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#666666',
    fontFamily: 'Urbanist',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 9,
    fontWeight: '400',
    color: '#C3C3C3',
    marginLeft: 8,
    fontFamily: 'Urbanist',
    lineHeight: 12,
  },
  totalAmount: {
    alignItems: 'flex-end',
  },
  totalAmountText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FF5B04',
    fontFamily: 'Urbanist',
  },
});

export default PostsScreen;
