import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { BatchCard } from '../../components/cards/BatchCard';
import { CustomButton } from '../../components/common/CustomButton';
import { mockBatches, mockStats } from '../../data/mockData';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
  StackNavigationProp<MainStackParamList>
>;

interface Props {
  navigation: DashboardNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good Morning'
      : currentHour < 17
      ? 'Good Afternoon'
      : 'Good Evening';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>🌿 {greeting}, Rajesh</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="menu-outline"
              size={24}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Today's Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockStats.batches}</Text>
              <Text style={styles.statLabel}>📦 Batches</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockStats.earnings}</Text>
              <Text style={styles.statLabel}>💰 Earnings</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockStats.quality}</Text>
              <Text style={styles.statLabel}>⭐ Quality</Text>
            </View>
          </View>
        </View>

        {/* Recent Collections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Collections:</Text>
          <View style={styles.batchGrid}>
            {mockBatches.slice(0, 2).map((batch) => (
              <View key={batch.id} style={styles.batchGridItem}>
                <BatchCard
                  batch={batch}
                  onPress={() =>
                    navigation.navigate('BatchDetail', { batchId: batch.id })
                  }
                />
              </View>
            ))}
          </View>
        </View>

        {/* New Collection Button */}
        <CustomButton
          title="+ New Collection"
          onPress={() => navigation.navigate('NewCollection')}
          size="large"
          style={styles.newCollectionButton}
        />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Collections')}
          >
            <Ionicons name="list" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Batches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="help-circle" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Help</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  batchGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  batchGridItem: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  newCollectionButton: {
    marginVertical: Spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
    fontFamily: Fonts.medium,
  },
});

export default DashboardScreen;
