import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { CustomButton } from '../../components/common/CustomButton';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🌿 HerbTrace Farmer</Text>
          
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={80} color={Colors.primary} />
          </View>
          
          <Text style={styles.subtitle}>Track Your Harvest</Text>
          <Text style={styles.subtitle}>from Farm to Market</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <Text style={styles.featureText}>Blockchain Security</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.featureText}>GPS Verification</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="trending-up" size={20} color={Colors.primary} />
            <Text style={styles.featureText}>Premium Pricing</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Get Started"
            onPress={() => navigation.navigate('Register')}
            size="large"
            style={styles.getStartedButton}
          />
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    marginVertical: Spacing.xl,
  },
  subtitle: {
    fontSize: Fonts.sizes.lg,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontFamily: Fonts.medium,
  },
  features: {
    marginBottom: Spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureText: {
    fontSize: Fonts.sizes.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    fontFamily: Fonts.regular,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  loginLink: {
    padding: Spacing.sm,
  },
  loginText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
