import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

// Import SVG icons
import ChevronRightIcon from '@/assets/images/chevron-right.svg';
import ProfileSettingsIcon from '@/assets/images/profile-settings-icon.svg';
import SettingsIcon from '@/assets/images/settings-icon.svg';
import NotificationIcon from '@/assets/images/notification-icon.svg';
import PaymentIcon from '@/assets/images/payment-icon.svg';
import HistoryIcon from '@/assets/images/history-icon.svg';
import LogoutIcon from '@/assets/images/logout-icon.svg';
import DeleteAccountIcon from '@/assets/images/delete-account-icon.svg';
import ProfileIcon from '@/assets/icons/profile-icon.svg';
import {useAuth} from '../../context/AuthContext';

const ProfileScreen = () => {
  const {signOut} = useAuth();
  const menuItems = [
    {
      id: 'profile-settings',
      title: 'Profil Ayarları',
      icon: ProfileSettingsIcon,
      highlighted: true,
      onPress: () => console.log('Profil Ayarları'),
    },
    {
      id: 'settings',
      title: 'Ayarlar',
      icon: SettingsIcon,
      onPress: () => console.log('Ayarlar'),
    },
    {
      id: 'notifications',
      title: 'Bildirimler',
      icon: NotificationIcon,
      onPress: () => console.log('Bildirimler'),
    },
    {
      id: 'payments',
      title: 'Ödemelerim',
      icon: PaymentIcon,
      onPress: () => console.log('Ödemelerim'),
    },
    {
      id: 'history',
      title: 'Gönderim Geçmişim',
      icon: HistoryIcon,
      onPress: () => console.log('Gönderim Geçmişi'),
    },
    {
      id: 'logout',
      title: 'Çıkış Yap',
      icon: LogoutIcon,
      onPress: () => signOut(),
    },
    {
      id: 'delete',
      title: 'Hesabımı Sil',
      icon: DeleteAccountIcon,
      onPress: () => console.log('Hesabımı Sil'),
    },
  ];

  const ProfileCard = () => (
    <View style={styles.profileCard}>
      <View style={styles.profileInfo}>
        <View style={styles.profilePhoto}>
          <ProfileIcon width={28} height={28} />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.profileName}>Rıdvan Berat Çalış</Text>
          <Text style={styles.profilePhone}>0 5xx xxx xx xx</Text>
        </View>
      </View>
      <View style={styles.separator} />

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <TouchableOpacity
              style={[
                styles.menuItem,
                item.highlighted && styles.highlightedMenuItem,
              ]}
              onPress={item.onPress}>
              <View style={styles.menuItemContent}>
                <item.icon width={20} height={20} fill="#FF5B04" />
                <Text
                  style={[
                    styles.menuItemText,
                    item.highlighted && styles.highlightedMenuText,
                  ]}>
                  {item.title}
                </Text>
              </View>
              {(item.id === 'profile-settings' || item.id === 'settings') && (
                <ChevronRightIcon
                  width={6}
                  height={12}
                  stroke="#6B7280"
                  strokeWidth={1.5}
                />
              )}
            </TouchableOpacity>
            {index < menuItems.length - 1 && !item.highlighted && (
              <View style={styles.menuSeparator} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  const SettingsCard = () => (
    <View style={styles.settingsCard}>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Tema</Text>
        <View style={styles.settingValue}>
          <Text style={styles.settingValueText}>Açık</Text>
          <ChevronRightIcon
            width={6}
            height={12}
            stroke="#6B7280"
            strokeWidth={1.5}
          />
        </View>
      </View>
      <View style={styles.settingSeparator} />
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dil</Text>
        <View style={styles.settingValue}>
          <Text style={styles.settingValueText}>Türkçe</Text>
          <ChevronRightIcon
            width={6}
            height={12}
            stroke="#6B7280"
            strokeWidth={1.5}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea} edges={[]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <ChevronRightIcon
              width={8}
              height={16}
              stroke="#FF5B04"
              strokeWidth={2}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profilim</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <ProfileCard />
          <SettingsCard />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 29,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    transform: [{rotate: '180deg'}],
  },
  headerTitle: {
    fontFamily: 'Urbanist',
    fontSize: 20,
    fontWeight: '700',
    color: '#FF5B04',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 29,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 8},
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 48,
    height: 48,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
    color: '#1F2937',
    lineHeight: 18,
  },
  profilePhone: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  menuContainer: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  highlightedMenuItem: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: -12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '400',
    color: '#1F2937',
    lineHeight: 20,
    marginLeft: 15,
  },
  highlightedMenuText: {
    color: '#000000',
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 45,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 8},
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLabel: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '400',
    color: '#1F2937',
    lineHeight: 20,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: 18,
    marginRight: 7,
  },
  settingSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
});

export default ProfileScreen;
