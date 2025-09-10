// MapViewScreen.web.tsx - Web version without react-native-maps
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { Header } from '../../components/common/Header';

type MapViewScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MapView'>;
type MapViewScreenRouteProp = RouteProp<MainStackParamList, 'MapView'>;

interface Props {
  navigation: MapViewScreenNavigationProp;
  route: MapViewScreenRouteProp;
}

interface CollectionPoint {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  status: 'collecting' | 'processing' | 'testing' | 'completed';
}

const MapViewScreen: React.FC<Props> = ({ navigation, route }) => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [collectionPoints] = useState<CollectionPoint[]>([
    {
      id: '1',
      title: 'Ashwagandha Collection',
      description: 'Premium grade herbs collected',
      coordinate: { latitude: 26.9124, longitude: 75.7873 },
      status: 'completed',
    },
    {
      id: '2',
      title: 'Turmeric Harvest',
      description: 'Fresh turmeric roots',
      coordinate: { latitude: 26.9200, longitude: 75.7900 },
      status: 'processing',
    },
  ]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show your current location');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getMarkerColor = (status: CollectionPoint['status']) => {
    switch (status) {
      case 'collecting': return Colors.primary;
      case 'processing': return Colors.warning;
      case 'testing': return Colors.info;
      case 'completed': return Colors.success;
      default: return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Collection Location"
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.mapContainer}>
        <View style={styles.webMapFallback}>
          <Ionicons name="location" size={80} color={Colors.primary} />
          <Text style={styles.webMapTitle}>Location Details</Text>
          
          {route.params?.coordinates && (
            <View style={styles.coordinateInfo}>
              <Text style={styles.coordinateLabel}>Target Location:</Text>
              <Text style={styles.coordinateValue}>
                Lat: {route.params.coordinates.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinateValue}>
                Lng: {route.params.coordinates.longitude.toFixed(6)}
              </Text>
            </View>
          )}
          
          {currentLocation && (
            <View style={styles.coordinateInfo}>
              <Text style={styles.coordinateLabel}>Current Location:</Text>
              <Text style={styles.coordinateValue}>
                Lat: {currentLocation.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinateValue}>
                Lng: {currentLocation.longitude.toFixed(6)}
              </Text>
            </View>
          )}
          
          <View style={styles.webCollectionPoints}>
            <Text style={styles.sectionTitle}>Collection Points:</Text>
            {collectionPoints.map((point) => (
              <View key={point.id} style={styles.collectionPoint}>
                <View style={[styles.statusIndicator, { backgroundColor: getMarkerColor(point.status) }]} />
                <View>
                  <Text style={styles.pointTitle}>{point.title}</Text>
                  <Text style={styles.pointDescription}>{point.description}</Text>
                  <Text style={styles.pointCoordinates}>
                    {point.coordinate.latitude.toFixed(4)}, {point.coordinate.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          
          <Text style={styles.webMapNote}>
            Interactive map is available on mobile devices
          </Text>
        </View>

        {/* Map controls overlay - hidden on web */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={getCurrentLocation}
          >
            <Ionicons name="locate" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location info panel */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoPanelTitle}>Location Information</Text>
        
        {currentLocation ? (
          <>
            <Text style={styles.locationText}>
              Latitude: {currentLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {currentLocation.longitude.toFixed(6)}
            </Text>
            <Text style={styles.accuracyText}>
              Location services available
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.locationText}>
              {route.params?.coordinates 
                ? `Lat: ${route.params.coordinates.latitude.toFixed(6)}`
                : 'Location not available'
              }
            </Text>
            <Text style={styles.locationText}>
              {route.params?.coordinates 
                ? `Lng: ${route.params.coordinates.longitude.toFixed(6)}`
                : 'Enable location services'
              }
            </Text>
          </>
        )}

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={styles.currentLocationText}>Update Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapControls: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
  },
  controlButton: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: Spacing.sm,
  },
  infoPanel: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoPanelTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  locationText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
    marginBottom: 2,
  },
  accuracyText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  currentLocationText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    marginLeft: Spacing.xs,
    fontFamily: Fonts.medium,
  },
  // Web-specific styles
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.gray50,
  },
  webMapTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  coordinateInfo: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    width: '100%',
    maxWidth: 300,
  },
  coordinateLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  coordinateValue: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  webCollectionPoints: {
    width: '100%',
    maxWidth: 400,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  collectionPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  pointTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  pointDescription: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pointCoordinates: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  webMapNote: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontStyle: 'italic',
  },
});

export default MapViewScreen;
