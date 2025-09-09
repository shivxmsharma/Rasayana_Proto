import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList, MainTabParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { BatchCard, BatchData } from '../../components/cards/BatchCard';
import { CustomButton } from '../../components/common/CustomButton';
import { mockBatches } from '../../data/mockData';

type CollectionsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Collections'>,
  StackNavigationProp<MainStackParamList>
>;

interface Props {
  navigation: CollectionsNavigationProp;
}

type FilterType = 'all' | 'active' | 'processing' | 'testing' | 'completed';

const CollectionsScreen: React.FC<Props> = ({ navigation }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchVisible, setSearchVisible] = useState(false);

  const filteredBatches = mockBatches.filter(batch => 
    filter === 'all' || batch.status === filter
  );

  const getFilterColor = (filterType: FilterType) => {
    return filter === filterType ? Colors.primary : Colors.gray400;
  };

  const renderBatch = ({ item }: { item: BatchData }) => (
    <BatchCard
      batch={item}
      onPress={() => navigation.navigate('BatchDetail', { batchId: item.id })}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, { color: getFilterColor('all') }]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'active' && styles.activeFilter]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterText, { color: getFilterColor('active') }]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'processing' && styles.activeFilter]}
            onPress={() => setFilter('processing')}
          >
            <Text style={[styles.filterText, { color: getFilterColor('processing') }]}>
              Processing
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Collections</Text>
        <TouchableOpacity
          onPress={() => setSearchVisible(!searchVisible)}
          style={styles.searchButton}
        >
          <Ionicons name="search" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredBatches}
        renderItem={renderBatch}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={60} color={Colors.gray400} />
            <Text style={styles.emptyText}>No collections found</Text>
            <Text style={styles.emptySubtext}>Start by creating your first collection</Text>
          </View>
        }
        ListFooterComponent={
          <CustomButton
            title="+ New Collection"
            onPress={() => navigation.navigate('NewCollection')}
            size="large"
            style={styles.newCollectionButton}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  title: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  searchButton: {
    padding: Spacing.sm,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    marginVertical: Spacing.md,
  },
  filterContainer: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  activeFilter: {
    backgroundColor: Colors.primary + '20',
  },
  filterText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  newCollectionButton: {
    marginTop: Spacing.lg,
  },
});

export default CollectionsScreen;
