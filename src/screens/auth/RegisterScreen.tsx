import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AuthStackParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { Header } from '../../components/common/Header';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { useAuth } from '../../contexts/AuthContext';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

interface FormData {
  fullName: string;
  phone: string;
  aadhaar: string;
  location: string;
  farmSize: string;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    aadhaar: '',
    location: '',
    farmSize: '',
  });
  
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickProfilePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const uploadCertificates = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newCertificates = result.assets.map(asset => asset.uri);
      setCertificates(prev => [...prev, ...newCertificates]);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user profile with entered data or demo data
      const userProfile = {
        fullName: formData.fullName || 'Demo Farmer',
        phone: formData.phone || '+91 9876543210',
        location: formData.location || 'Rajasthan, India',
        farmSize: formData.farmSize || '5 acres',
        profilePhoto: profilePhoto || undefined,
      };
      
      // Register and automatically log in the user
      register(userProfile);
      
      // Optional: Show success message (user will be navigated automatically due to auth state change)
      Alert.alert(
        'Success',
        'Registration successful! Welcome to HerbTrace Farmer.',
        [{ text: 'Continue', onPress: () => {} }]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    // Instant access with demo data
    register({
      fullName: 'Demo Farmer',
      phone: '+91 9876543210',
      location: 'Rajasthan, India',
      farmSize: '5 acres',
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Register as Farmer"
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.photoUpload} onPress={pickProfilePhoto}>
          {profilePhoto ? (
            <View style={styles.photoContainer}>
              {/* In a real app, you'd use Image component here */}
              <Ionicons name="person" size={50} color={Colors.gray400} />
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={30} color={Colors.gray400} />
              <Text style={styles.photoText}>Upload Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <CustomInput
          label="Full Name"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
          placeholder="Enter your full name"
          required
        />

        <CustomInput
          label="Phone Number"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          required
        />

        <CustomInput
          label="Aadhaar Number"
          value={formData.aadhaar}
          onChangeText={(value) => handleInputChange('aadhaar', value)}
          placeholder="Enter your Aadhaar number"
          keyboardType="numeric"
          maxLength={12}
          required
        />

        <CustomInput
          label="Location"
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
          placeholder="Enter your location"
        />

        <CustomInput
          label="Farm Size (acres)"
          value={formData.farmSize}
          onChangeText={(value) => handleInputChange('farmSize', value)}
          placeholder="Enter farm size"
          keyboardType="numeric"
        />

        <View style={styles.certificateSection}>
          <Text style={styles.sectionTitle}>Certificates:</Text>
          <CustomButton
            title="Upload Documents"
            onPress={uploadCertificates}
            variant="outline"
            size="medium"
          />
          {certificates.length > 0 && (
            <Text style={styles.certificateCount}>
              {certificates.length} document(s) uploaded
            </Text>
          )}
        </View>

        <CustomButton
          title="Register"
          onPress={handleRegister}
          loading={loading}
          size="large"
          style={styles.registerButton}
        />
        
        <View style={styles.demoSection}>
          <Text style={styles.orText}>or</Text>
          <CustomButton
            title="Quick Demo Access"
            onPress={handleQuickDemo}
            variant="outline"
            size="large"
            style={styles.demoButton}
          />
          <Text style={styles.demoText}>
            Skip registration and try the app with sample data
          </Text>
        </View>
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
    paddingHorizontal: Spacing.lg,
  },
  photoUpload: {
    alignSelf: 'center',
    marginVertical: Spacing.lg,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray300,
    borderStyle: 'dashed',
  },
  photoText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  certificateSection: {
    marginVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  certificateCount: {
    fontSize: Fonts.sizes.sm,
    color: Colors.success,
    marginTop: Spacing.sm,
  },
  registerButton: {
    marginVertical: Spacing.xl,
  },
  demoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  orText: {
    fontSize: Fonts.sizes.md,
    color: Colors.textSecondary,
    fontFamily: Fonts.medium,
    marginBottom: Spacing.md,
  },
  demoButton: {
    marginBottom: Spacing.sm,
  },
  demoText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
});

export default RegisterScreen;
