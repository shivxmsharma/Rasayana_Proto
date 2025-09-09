import React, { useState, useEffect } from 'react';
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
import * as Location from 'expo-location';
import { MainStackParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { Header } from '../../components/common/Header';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';

type NewCollectionNavigationProp = StackNavigationProp<MainStackParamList, 'NewCollection'>;

interface Props {
  navigation: NewCollectionNavigationProp;
}

interface FormData {
  species: string;
  quantity: string;
  weather: string;
  soilQuality: 'excellent' | 'good' | 'average' | 'poor' | '';
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const species = [
  'Ashwagandha',
  'Turmeric',
  'Brahmi',
  'Neem',
  'Tulsi',
  'Ginger',
  'Fenugreek',
  'Other'
];

const weatherOptions = [
  'Clear, 25°C',
  'Cloudy, 23°C',
  'Light Rain, 22°C',
  'Sunny, 28°C',
  'Overcast, 24°C'
];

const NewCollectionScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    species: '',
    quantity: '',
    weather: '',
    soilQuality: '',
  });
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for collection tracking.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || 0,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSoilQualitySelect = (quality: FormData['soilQuality']) => {
    setFormData(prev => ({ ...prev, soilQuality: quality }));
  };

  const handleTakePhotos = () => {
    navigation.navigate('Camera');
  };

  const handleSubmit = async () => {
    if (!formData.species || !formData.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location is required for collection tracking');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Collection recorded successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to record collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="New Collection"
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowSpeciesDropdown(!showSpeciesDropdown)}
          >
            <Text style={[styles.dropdownText, !formData.species && styles.placeholder]}>
              {formData.species || 'Select Species'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={Colors.gray400} />
          </TouchableOpacity>
          
          {showSpeciesDropdown && (
            <View style={styles.dropdownOptions}>
              {species.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownOption}
                  onPress={() => {
                    handleInputChange('species', item);
                    setShowSpeciesDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.locationSection}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.locationTitle}>Location</Text>
            <TouchableOpacity onPress={getCurrentLocation} disabled={locationLoading}>
              <Ionicons 
                name="refresh" 
                size={20} 
                color={locationLoading ? Colors.gray400 : Colors.primary} 
              />
            </TouchableOpacity>
          </View>
          
          {location ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                GPS: {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
              </Text>
              <Text style={styles.accuracyText}>
                Accuracy: ±{Math.round(location.accuracy)}m
              </Text>
            </View>
          ) : (
            <Text style={styles.locationError}>Getting location...</Text>
          )}
        </View>

        <CustomInput
          label="Quantity"
          value={formData.quantity}
          onChangeText={(value) => handleInputChange('quantity', value)}
          placeholder="Enter quantity in kg"
          keyboardType="numeric"
          required
        />

        <View style={styles.section}>
          <Text style={styles.label}>Weather:</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowWeatherDropdown(!showWeatherDropdown)}
          >
            <Text style={[styles.dropdownText, !formData.weather && styles.placeholder]}>
              {formData.weather || 'Select Weather'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={Colors.gray400} />
          </TouchableOpacity>
          
          {showWeatherDropdown && (
            <View style={styles.dropdownOptions}>
              {weatherOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownOption}
                  onPress={() => {
                    handleInputChange('weather', item);
                    setShowWeatherDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Soil Quality:</Text>
          <View style={styles.radioGroup}>
            {(['excellent', 'good', 'average', 'poor'] as const).map((quality) => (
              <TouchableOpacity
                key={quality}
                style={styles.radioOption}
                onPress={() => handleSoilQualitySelect(quality)}
              >
                <View style={styles.radio}>
                  {formData.soilQuality === quality && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioText}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <CustomButton
          title="📷 Take Photos"
          onPress={handleTakePhotos}
          variant="outline"
          size="large"
          style={styles.photoButton}
        />

        <CustomButton
          title="Record Collection"
          onPress={handleSubmit}
          loading={loading}
          size="large"
          style={styles.submitButton}
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
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    minHeight: 48,
  },
  dropdownText: {
    fontSize: Fonts.sizes.md,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.gray400,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: Colors.white,
    maxHeight: 200,
  },
  dropdownOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  dropdownOptionText: {
    fontSize: Fonts.sizes.md,
    color: Colors.textPrimary,
  },
  locationSection: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  locationInfo: {
    marginTop: Spacing.sm,
  },
  locationText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
  },
  accuracyText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  locationError: {
    fontSize: Fonts.sizes.sm,
    color: Colors.error,
    fontStyle: 'italic',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray400,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textPrimary,
  },
  photoButton: {
    marginBottom: Spacing.md,
  },
  submitButton: {
    marginBottom: Spacing.xl,
  },
});

export default NewCollectionScreen;
