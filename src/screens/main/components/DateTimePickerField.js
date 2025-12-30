import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimePickerField = ({
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  mode = 'date', // 'date' or 'time'
  invisibleLabel = false,
}) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const handleChange = (event, selectedDate) => {
    // On Android, native picker handles its own confirmation
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setTempDate(selectedDate);
        onChange?.(selectedDate);
      }
      setShow(false);
      return;
    }

    // On iOS, just update temp value without closing
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    onChange?.(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShow(false);
  };

  const formatValue = date => {
    if (!date) return '';

    if (mode === 'date') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } else {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, invisibleLabel && styles.labelInvisible]}>
        {label}
      </Text>
      <TouchableOpacity
        style={styles.box}
        activeOpacity={0.8}
        onPress={() => setShow(true)}>
        <View style={styles.inner}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon width={20} height={20} />
            </View>
          ) : null}
          <Text
            style={[styles.input, !value && styles.placeholderText]}
            numberOfLines={1}>
            {value ? formatValue(value) : placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempDate}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={handleChange}
          minimumDate={mode === 'date' ? new Date() : undefined}
        />
      )}

      {show && Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          onRequestClose={handleCancel}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {mode === 'date' ? 'Tarih Seçin' : 'Saat Seçin'}
                </Text>
              </View>

              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={tempDate}
                  mode={mode}
                  is24Hour={true}
                  display="spinner"
                  onChange={handleChange}
                  minimumDate={mode === 'date' ? new Date() : undefined}
                  style={styles.picker}
                  textColor="#0F172A"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                  activeOpacity={0.8}>
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirm}
                  activeOpacity={0.8}>
                  <Text style={styles.confirmButtonText}>Onayla</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {width: 340},
  label: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#A1A1AA',
    marginBottom: 6,
  },
  labelInvisible: {opacity: 0},
  box: {
    width: 340,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  inner: {flexDirection: 'row', alignItems: 'center', gap: 8},
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'Urbanist',
    fontSize: 16,
    lineHeight: 20,
    color: '#0F172A',
  },
  placeholderText: {
    color: '#A1A1AA',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    paddingTop: 20,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4EEF0',
  },
  modalTitle: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 22,
    color: '#0F172A',
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 216,
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F6F7FB',
  },
  cancelButtonText: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 16,
    color: '#A1A1AA',
  },
  confirmButton: {
    backgroundColor: '#FF5B04',
  },
  confirmButtonText: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default DateTimePickerField;
