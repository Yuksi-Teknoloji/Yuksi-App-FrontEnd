import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import ArrowLeftOrangeIcon from '@/assets/icons/arrow-left-orange.svg';
import { useRoute } from '@react-navigation/native';

const ModelSelectScreen = ({ navigation }) => {
  const route = useRoute();
  const { parentId, parentName } = route.params || {};

  // Mock sub models; replace with API fetch using parentId later
  const subModels = [
    { id: 'a', name: `${parentName} Alt Model 1`, count: 5 },
    { id: 'b', name: `${parentName} Alt Model 2`, count: 9 },
    { id: 'c', name: `${parentName} Alt Model 3`, count: 2 },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemRow} onPress={() => { /* Future: navigate deeper or select */ }}>
      <Text style={styles.itemText} numberOfLines={1}>
        {item.name} ({item.count})
      </Text>
      <ArrowRightIcon width={18} height={18} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Geri dön"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeftOrangeIcon width={26} height={26} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>Model Seç</Text>
        </View>
      </View>
      <FlatList
        data={subModels}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FC' },
  header: {
    backgroundColor: '#FFFFFF',
    width: 412,
    height: 100,
    alignSelf: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    paddingLeft: 33,
    paddingTop: 42,
    justifyContent: 'flex-start',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
    color: '#FF5B04',
    fontFamily: 'Urbanist',
    flex: 1,
    height: 24,
  },
  backButton: { marginRight: 12, justifyContent: 'center', alignItems: 'center', height: 24 },
  listContent: { padding: 16 },
  itemRow: {
    width: 383,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E1E',
    fontFamily: 'Urbanist',
    flex: 1,
    paddingRight: 12,
  },
});

export default ModelSelectScreen;
