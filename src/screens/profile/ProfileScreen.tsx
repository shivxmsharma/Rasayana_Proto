import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { CustomButton } from '../../components/common/CustomButton';
import { mockStats } from '../../data/mockData';
import * as ImagePicker from 'expo-image-picker';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, MainStackParamList } from '../../types/navigation';

type ProfileNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  StackNavigationProp<MainStackParamList>
>;

interface Props {
  navigation: ProfileNavigationProp;
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  earned: boolean;
}

const achievements: Achievement[] = [
  { id: '1', title: 'Quality Farmer', icon: '🏆', earned: true },
  { id: '2', title: 'Sustainable Harvester', icon: '🌱', earned: true },
  { id: '3', title: 'Tech Pioneer', icon: '💡', earned: false },
  { id: '4', title: 'Master Cultivator', icon: '👨‍🌾', earned: false },
];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const defaultImage = require('../../../assets/default-profile.png');

  const farmerData = {
    name: 'Rajesh Kumar',
    farmerId: 'F001',
    phone: '+91 98765 43210',
    location: 'Rajasthan, India',
    joinDate: 'January 2024',
  };

  const handleGalleryAccess = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Permission to access gallery is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error accessing gallery:', error);
      alert('Error accessing gallery');
    }
  };

  const handleCameraAccess = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Error accessing camera');
    }
  };

  const handleImagePick = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose a source',
      [
        {
          text: 'Camera',
          onPress: handleCameraAccess,
        },
        {
          text: 'Gallery',
          onPress: handleGalleryAccess,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={selectedImage ? { uri: selectedImage } : defaultImage}
              style={styles.profileImage}
              defaultSource={defaultImage}
            />
            <TouchableOpacity 
              style={styles.editImageButton}
              onPress={handleImagePick}
            >
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.farmerName}>{farmerData.name}</Text>
          <Text style={styles.farmerId}>Farmer ID: {farmerData.farmerId}</Text>
          
          <View style={styles.farmerDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="call-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{farmerData.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{farmerData.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText}>Member since {farmerData.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* Statistics Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.totalBatches}</Text>
              <Text style={styles.statLabel}>Total Batches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.thisMonth}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.successRate}</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.totalEarnings}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>🏆 Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={[
                  styles.achievementIcon,
                  !achievement.earned && styles.achievementIconDisabled
                ]}>
                  <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                </View>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.achievementTitleDisabled
                ]}>
                  {achievement.title}
                </Text>
                {achievement.earned && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="Edit Profile"
            onPress={() => console.log('Edit Profile')} // Add actual handler
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
          
          <CustomButton
            title="Certificates"
            onPress={() => console.log('Certificates')} // Add actual handler
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Collections')}
          >
            <Ionicons name="list-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>View Collections</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Ionicons name="qr-code-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>QR Scanner</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
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
  title: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
    padding: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray200,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  farmerName: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  farmerId: {
    fontSize: Fonts.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  farmerDetails: {
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  statsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statValue: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  achievementsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementsList: {
    marginTop: Spacing.sm,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  achievementIconDisabled: {
    opacity: 0.5,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementTitle: {
    flex: 1,
    fontSize: Fonts.sizes.sm,
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
  },
  achievementTitleDisabled: {
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  quickActionsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  quickActionText: {
    flex: 1,
    fontSize: Fonts.sizes.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
    fontFamily: Fonts.medium,
  },
});

export default ProfileScreen;