import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { Header } from '../../components/common/Header';
import { CustomButton } from '../../components/common/CustomButton';

type SettingsScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you'd clear authentication state here
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          }
        }
      ]
    );
  };

  const SettingItem: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightComponent?: React.ReactNode;
  }> = ({ icon, title, subtitle, onPress, showChevron = true, rightComponent }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={Colors.primary} />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showChevron && !rightComponent && (
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => {/* Navigate to edit profile */}}
            />
            <SettingItem
              icon="document-text-outline"
              title="Certificates"
              subtitle="Manage your certifications"
              onPress={() => {/* Navigate to certificates */}}
            />
            <SettingItem
              icon="card-outline"
              title="Bank Details"
              subtitle="Update payment information"
              onPress={() => {/* Navigate to bank details */}}
            />
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="language-outline"
              title="Language"
              subtitle={language}
              onPress={() => {
                Alert.alert('Language', 'Language selection coming soon!');
              }}
            />
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Receive updates about your collections"
              showChevron={false}
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: Colors.gray300, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              }
            />
            <SettingItem
              icon="sync-outline"
              title="Offline Sync"
              subtitle="Sync data when internet is available"
              showChevron={false}
              rightComponent={
                <Switch
                  value={offlineSync}
                  onValueChange={setOfflineSync}
                  trackColor={{ false: Colors.gray300, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              }
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="help-circle-outline"
              title="Help Center"
              subtitle="Get help and support"
              onPress={() => {
                Alert.alert('Help Center', 'Help center coming soon!');
              }}
            />
            <SettingItem
              icon="chatbubbles-outline"
              title="Contact Support"
              subtitle="Reach out to our team"
              onPress={() => {
                Alert.alert('Contact Support', 'Support contact coming soon!');
              }}
            />
            <SettingItem
              icon="play-circle-outline"
              title="Tutorial"
              subtitle="Learn how to use the app"
              onPress={() => {
                Alert.alert('Tutorial', 'App tutorial coming soon!');
              }}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="information-circle-outline"
              title="Version"
              subtitle="1.0.0"
              showChevron={false}
            />
            <SettingItem
              icon="document-outline"
              title="Terms of Service"
              onPress={() => {
                Alert.alert('Terms of Service', 'Terms of service coming soon!');
              }}
            />
            <SettingItem
              icon="shield-outline"
              title="Privacy Policy"
              onPress={() => {
                Alert.alert('Privacy Policy', 'Privacy policy coming soon!');
              }}
            />
          </View>
        </View>

        {/* Logout Button */}
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          size="large"
          style={{
            ...styles.logoutButton,
            borderColor: Colors.error,
          }}
          textStyle={{ color: Colors.error }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.bold,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  sectionContent: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
  },
});

export default SettingsScreen;
