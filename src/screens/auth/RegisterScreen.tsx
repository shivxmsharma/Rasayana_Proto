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
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.aadhaar) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Registration successful! Please login with your credentials.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
});

export default RegisterScreen;
