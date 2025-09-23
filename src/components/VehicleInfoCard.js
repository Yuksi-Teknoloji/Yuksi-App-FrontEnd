import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import React from 'react';

const VehicleInfoCard = ({
  title,
  image: ImageComponent,
  description,
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={() => {}}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Centered Content Container */}
          <View style={styles.centeredContent}>
            {/* Vehicle Image */}
            <View style={styles.imageContainer}>
              {ImageComponent && <ImageComponent width={200} height={200} />}
            </View>

            {/* Description */}
            <Text style={styles.description}>{description}</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default VehicleInfoCard;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    height: '70%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF8F4',
    borderRadius: 10,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 12,
  },
  title: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 28,
    marginTop: 20,
    color: '#393939',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 14,
    color: '#1E1E1E',
    textAlign: 'left',
    paddingHorizontal: 30,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
