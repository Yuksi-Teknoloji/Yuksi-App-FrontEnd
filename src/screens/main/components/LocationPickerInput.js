import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import {WebView} from 'react-native-webview';

const LocationPickerInput = ({
  label,
  placeholder,
  icon: Icon,
  value,
  onLocationSelect,
  invisibleLabel = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(value || '');
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const webViewRef = useRef(null);

  // Parse OSM address data into structured fields
  const parseOSMAddress = osmAddress => {
    if (!osmAddress) return null;

    // OSM Türkiye yapısı:
    // province/state = İl (İstanbul)
    // county = İlçe (Fatih, Kadıköy, etc.)
    // suburb/district = Alt bölge / mahalle civarı
    // neighbourhood/quarter = Mahalle

    return {
      city:
        osmAddress.province ||
        osmAddress.state ||
        osmAddress.city ||
        osmAddress.town ||
        '',
      district:
        osmAddress.county ||
        osmAddress.municipality ||
        osmAddress.town ||
        '',
      neighbourhood:
        osmAddress.neighbourhood ||
        osmAddress.quarter ||
        osmAddress.suburb ||
        osmAddress.hamlet ||
        '',
      street: osmAddress.road || osmAddress.street || '',
      buildingNumber: osmAddress.house_number || '',
      floor: '', // OSM typically doesn't provide floor
      apartmentNumber: '', // OSM typically doesn't provide apartment number
      postcode: osmAddress.postcode || '',
    };
  };

  useEffect(() => {
    if (value) {
      setAddress(value);
    }
  }, [value]);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsSearching(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText,
        )}&addressdetails=1&limit=1`,
        {
          headers: {
            'User-Agent': 'YuksiApp/1.0',
          },
        },
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const coords = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };

        // Send coordinates to map
        webViewRef.current?.injectJavaScript(`
          window.map.setView([${coords.latitude}, ${coords.longitude}], 15);
          window.marker.setLatLng([${coords.latitude}, ${coords.longitude}]);
          true;
        `);

        const parsedAddress = parseOSMAddress(result.address);

        setSelectedLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: result.display_name,
          addressDetails: parsedAddress,
        });
      }
    } catch (error) {
      console.warn('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      setAddress(selectedLocation.address);
      onLocationSelect?.(selectedLocation);
      setModalVisible(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setSearchText('');
    if (value) {
      setSearchText(value);
    }
  };

  const handleWebViewMessage = event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'locationSelected') {
        const parsedAddress = parseOSMAddress(data.addressDetails || {});

        setSelectedLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          addressDetails: parsedAddress,
        });
      }
    } catch (error) {
      console.warn('WebView message error:', error);
    }
  };

  const mapHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; }
    #map { height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    // Initialize map
    const map = L.map('map').setView([41.0082, 28.9784], 12);
    window.map = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Custom marker icon (orange)
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width: 32px; height: 32px; border-radius: 50%; background-color: #FF5B04; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Add marker
    const marker = L.marker([41.0082, 28.9784], { icon: customIcon }).addTo(map);
    window.marker = marker;

    // Handle map click
    map.on('click', async function(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Move marker
      marker.setLatLng([lat, lng]);

      // Reverse geocode
      try {
        const response = await fetch(
          \`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lng}&addressdetails=1\`,
          {
            headers: {
              'User-Agent': 'YuksiApp/1.0'
            }
          }
        );
        const data = await response.json();
        const address = data.display_name || \`\${lat}, \${lng}\`;

        // Send to React Native with address details
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'locationSelected',
          latitude: lat,
          longitude: lng,
          address: address,
          addressDetails: data.address || {}
        }));
      } catch (error) {
        console.error('Geocoding error:', error);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'locationSelected',
          latitude: lat,
          longitude: lng,
          address: \`\${lat}, \${lng}\`,
          addressDetails: {}
        }));
      }
    });
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, invisibleLabel && styles.labelInvisible]}>
        {label}
      </Text>
      <TouchableOpacity
        style={styles.box}
        activeOpacity={0.8}
        onPress={openModal}>
        <View style={styles.inner}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon width={20} height={20} />
            </View>
          ) : null}
          <Text
            style={[styles.input, !address && styles.placeholderText]}
            numberOfLines={1}>
            {address || placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Search bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Konum ara..."
              placeholderTextColor="#A1A1AA"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={isSearching}>
              {isSearching ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>Ara</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Map WebView */}
          <View style={styles.mapContainer}>
            <WebView
              ref={webViewRef}
              source={{html: mapHTML}}
              style={styles.map}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
            />
          </View>

          {/* Selected address display */}
          {selectedLocation && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Seçilen Konum:</Text>
              <Text style={styles.addressText} numberOfLines={2}>
                {selectedLocation.address}
              </Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
              disabled={!selectedLocation}>
              <Text style={styles.confirmButtonText}>Onayla</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#E4EEF0',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4EEF0',
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F6F7FB',
    paddingHorizontal: 16,
    fontFamily: 'Urbanist',
    fontSize: 16,
    color: '#0F172A',
  },
  searchButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#FF5B04',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E4EEF0',
  },
  addressLabel: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 14,
    color: '#A1A1AA',
    marginBottom: 4,
  },
  addressText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    color: '#0F172A',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  button: {
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

export default LocationPickerInput;
