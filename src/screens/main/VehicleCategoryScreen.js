import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import MotorsikletIcon from '@/assets/images/motorcycle.svg';
import MinivanIcon from '@/assets/images/minivan.svg';
import PanelvanIcon from '@/assets/images/panelvan.svg';
import KamyonetIcon from '@/assets/images/pickup-truck.svg';
import KamyonIcon from '@/assets/images/truck.svg';
import SaveIcon from '@/assets/images/save.svg';

const VehicleCategoryScreen = ({navigation}) => {
  const vehicleCategories = [
    {
      id: 1,
      name: 'Motorsiklet',
      adCount: '2.000 İlan',
      IconComponent: MotorsikletIcon,
    },
    {
      id: 2,
      name: 'Minivan',
      adCount: '2.500 İlan',
      IconComponent: MinivanIcon,
    },
    {
      id: 3,
      name: 'Panelvan',
      adCount: '1.500 İlan',
      IconComponent: PanelvanIcon,
    },
    {
      id: 4,
      name: 'Kamyonet',
      adCount: '500 İlan',
      IconComponent: KamyonetIcon,
    },
    {
      id: 5,
      name: 'Kamyon',
      adCount: '200 İlan',
      IconComponent: KamyonIcon,
    },
  ];

  const VehicleCard = ({item}) => (
    <TouchableOpacity style={styles.vehicleCard}>
      <View style={styles.imageContainer}>
        <item.IconComponent width={100} height={81} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <Text style={styles.adCount}>{item.adCount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Araç Sınıfları</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.inactiveTab]}>
            <Text style={styles.inactiveTabText}>Mesajlarım</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              styles.activeTab,
              {flexDirection: 'row', gap: 5},
            ]}>
            <SaveIcon width={20} height={20} />
            <Text style={styles.activeTabText}>Kayıtlı</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>İlanlarım</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Description */}
        <Text style={styles.description}>
          Ticarim, sadece ticari araç alım satımı yapılan bir pazar yeridir.
          İstersen ilan ver diyerek aracını satabilir yada yüzlerce ilan
          arasından sana uygun olanı seçebilsin.
        </Text>

        {/* Vehicle Categories */}
        <View style={styles.categoriesContainer}>
          {vehicleCategories.map(item => (
            <VehicleCard key={item.id} item={item} />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.returnButtonText}>Yüksiye Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createAdButton}>
            <Text style={styles.createAdButtonText}>İlan Ver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF5B04',
    fontFamily: 'Urbanist',
  },
  content: {
    flex: 1,
    paddingHorizontal: 17,
  },
  description: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E1E1E',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontFamily: 'Urbanist',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF5B04',
    borderColor: '#FF5B04',
  },
  inactiveTab: {
    backgroundColor: '#386BF6',
    borderColor: '#386BF6',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Urbanist',
  },
  inactiveTabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Urbanist',
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#FFF8F4',
    borderRadius: 10,
    margin: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Urbanist',
    letterSpacing: 0.1,
  },
  adCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF5B04',
    fontFamily: 'Urbanist',
    position: 'absolute',
    right: 20,
    bottom: -10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  returnButton: {
    backgroundColor: '#FF5B04',
    borderRadius: 9,
    paddingVertical: 11,
    alignItems: 'center',
    width: '45%',
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Urbanist',
  },
  createAdButton: {
    backgroundColor: '#386BF6',
    borderRadius: 9,
    paddingVertical: 11,
    alignItems: 'center',
    width: '45%',
  },
  createAdButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Urbanist',
  },
});

export default VehicleCategoryScreen;
