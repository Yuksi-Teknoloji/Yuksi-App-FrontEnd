import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Icons
import ProfileIcon from '@/assets/icons/profile-icon.svg';
import LocationFromIcon from '@/assets/icons/location-from.svg';
import PaymentIcon from '@/assets/images/payment-icon.svg';

// Display-only forum: shows labels with icons and values per latest spec
// Props can be provided directly or via `order` object
const DisplayOrderForum = ({
  carrierType,
  pickup,
  dropoff,
  note,
  total,
  order,
}) => {
  const cType = (order?.carrierType ?? carrierType ?? '').trim();
  const pick = (order?.pickup ?? pickup ?? '').trim();
  const drop = (order?.dropoff ?? dropoff ?? '').trim();
  const noteVal = (order?.note ?? note ?? '').trim();
  const totalVal = (order?.total ?? total ?? '').trim();

  return (
    <View style={styles.wrap}>
      {/* Taşıyıcı Türü: same line, profile icon before label */}
      <View style={styles.row}>
        <ProfileIcon width={18} height={18} />
        <Text style={styles.label}>Taşıyıcı Türü:</Text>
        <Text style={styles.inlineValue}>{cType || '-'}</Text>
      </View>

      {/* Alış Noktası: new line for data, location icon before label */}
      <View style={styles.block}>
        <View style={styles.row}>
          <LocationFromIcon width={18} height={18} />
          <Text style={styles.label}>Alış Noktası:</Text>
        </View>
        <Text style={styles.blockValue} numberOfLines={3}>{pick || '-'}</Text>
      </View>

      {/* Varış Noktası: new line for data, location icon before label */}
      <View style={styles.block}>
        <View style={styles.row}>
          <LocationFromIcon width={18} height={18} />
          <Text style={styles.label}>Varış Noktası:</Text>
        </View>
        <Text style={styles.blockValue} numberOfLines={3}>{drop || '-'}</Text>
      </View>

      {/* Taşıyıcıya Notu: render data on new line only if exists */}
      <View style={styles.block}>
        <View style={styles.row}>
          <Text style={styles.label}>Taşıyıcıya Notu:</Text>
        </View>
        {noteVal ? (
          <Text style={styles.blockValue} numberOfLines={5}>{noteVal}</Text>
        ) : null}
      </View>

      {/* Toplam Tutar: same line, wallet icon before label */}
      <View style={styles.row}>
        <PaymentIcon width={18} height={18} />
        <Text style={styles.label}>Toplam Tutar:</Text>
        <Text style={styles.inlineValue}>{totalVal || '-'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 8,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  block: {
    gap: 6,
  },
  label: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#0F172A',
  },
  inlineValue: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: '#0F172A',
  },
  blockValue: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 22,
    color: '#0F172A',
    paddingLeft: 26, // indent to visually align under label/icon
  },
});

export default DisplayOrderForum;
