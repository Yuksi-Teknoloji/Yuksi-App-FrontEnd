import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const AddressDetailFields = ({addressDetails, onAddressDetailsChange}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const updateField = (field, value) => {
    onAddressDetailsChange({
      ...addressDetails,
      [field]: value,
    });
  };

  const renderField = (label, field, placeholder, required = false) => {
    return (
      <View style={styles.fieldWrapper}>
        <Text style={styles.fieldLabel}>
          {label}
          {required && <Text style={styles.requiredMark}> *</Text>}
        </Text>
        <TextInput
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor="#A1A1AA"
          value={addressDetails?.[field] || ''}
          onChangeText={text => updateField(field, text)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Adres Detayları</Text>
        <TouchableOpacity
          onPress={toggleExpanded}
          style={styles.toggleButton}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.toggleIcon,
              !isExpanded && styles.toggleIconCollapsed,
            ]}>
            ▼
          </Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.row}>
            {renderField('Şehir', 'city', 'Şehir', true)}
            {renderField('İlçe', 'district', 'İlçe', true)}
          </View>

          <View style={styles.fullWidth}>
            {renderField('Mahalle', 'neighbourhood', 'Mahalle', true)}
          </View>

          <View style={styles.fullWidth}>
            {renderField('Sokak/Cadde', 'street', 'Sokak/Cadde', true)}
          </View>

          <View style={styles.row}>
            {renderField('Bina No', 'buildingNumber', 'No', true)}
            {renderField('Kat', 'floor', 'Kat', true)}
          </View>

          <View style={styles.fullWidth}>
            {renderField('Daire No', 'apartmentNumber', 'Daire No', true)}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 340,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: '#0F172A',
  },
  toggleButton: {
    padding: 4,
    marginRight: -4,
  },
  toggleIcon: {
    fontSize: 16,
    color: '#FF5B04',
    fontWeight: 'bold',
    transform: [{rotate: '0deg'}],
  },
  toggleIconCollapsed: {
    transform: [{rotate: '180deg'}],
  },
  content: {
    // No animation, just show/hide
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  fullWidth: {
    marginBottom: 12,
  },
  fieldWrapper: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 6,
  },
  requiredMark: {
    color: '#FF5B04',
  },
  fieldInput: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F6F7FB',
    paddingHorizontal: 12,
    fontFamily: 'Urbanist',
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E4EEF0',
  },
});

export default AddressDetailFields;
