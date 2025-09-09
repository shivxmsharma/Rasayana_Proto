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

// Conditional import for react-native-maps (only on mobile platforms)
let MapView: any, Marker: any, Circle: any;
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Circle = maps.Circle;
}

type MapViewScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MapView'>;
type MapViewScreenRouteProp = RouteProp<MainStackParamList, 'MapView'>;

interface Props {
  navigation: MapViewScreenNavigationProp;
  route: MapViewScreenRouteProp;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const MapViewScreen: React.FC<Props> = ({ navigation, route }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);

  // Collection points (mock data)
  const collectionPoints = [
    {
      id: 'ASH001',
      coordinate: { latitude: 26.9124, longitude: 75.7873 },
      title: 'Ashwagandha Collection',
      description: 'Sept 1, 2025 - 25kg',
      status: 'active',
    },
    {
      id: 'TUR002',
      coordinate: { latitude: 26.9200, longitude: 75.7900 },
      title: 'Turmeric Collection',
      description: 'Sept 2, 2025 - 18kg',
      status: 'processing',
    },
    {
      id: 'BRA003',
      coordinate: { latitude: 26.9080, longitude: 75.7820 },
      title: 'Brahmi Collection',
      description: 'Aug 28, 2025 - 12kg',
      status: 'testing',
    },
  ];

  // Default region (Rajasthan, India)
  const defaultRegion = {
    latitude: 26.9124,
    longitude: 75.7873,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'processing': return Colors.warning;
      case 'testing': return Colors.info;
      case 'completed': return Colors.gray500;
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
        {Platform.OS === 'web' ? (
          <View style={styles.webMapFallback}>
            <Ionicons name="location" size={80} color={Colors.primary} />
            <Text style={styles.webMapTitle}>Location Details</Text>
            
            {route.params?.coordinates && (
              <View style={styles.coordinateInfo}>
                <Text style={styles.coordinateLabel}>Target Location:</Text>
                <Text style={styles.coordinateValue}>
                  {route.params.coordinates.latitude.toFixed(6)}, {route.params.coordinates.longitude.toFixed(6)}
                </Text>
              </View>
            )}
            
            {currentLocation && (
              <View style={styles.coordinateInfo}>
                <Text style={styles.coordinateLabel}>Current Location:</Text>
                <Text style={styles.coordinateValue}>
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
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
        ) : (
          <MapView
            style={styles.map}
            initialRegion={route.params?.coordinates ? {
              ...route.params.coordinates,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            } : defaultRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {/* Collection point markers */}
            {collectionPoints.map((point) => (
              <Marker
                key={point.id}
                coordinate={point.coordinate}
                title={point.title}
                description={point.description}
                pinColor={getMarkerColor(point.status)}
              />
            ))}

            {/* Accuracy circle for current location */}
            {currentLocation && (
              <Circle
                center={currentLocation}
                radius={50} // 50 meter radius
                strokeColor={Colors.primary}
                fillColor={Colors.primary + '20'}
                strokeWidth={2}
              />
            )}
          </MapView>
        )}

        {/* Map controls overlay */}
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
        <Text style={styles.infoPanelTitle}>Collection Point:</Text>
        
        {route.params?.coordinates ? (
          <>
            <Text style={styles.locationText}>
              Lat: {route.params.coordinates.latitude.toFixed(4)}°N
            </Text>
            <Text style={styles.locationText}>
              Long: {route.params.coordinates.longitude.toFixed(4)}°E
            </Text>
            <Text style={styles.accuracyText}>
              Accuracy: ±3m
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.locationText}>
              Lat: 26.9124°N
            </Text>
            <Text style={styles.locationText}>
              Long: 75.7873°E
            </Text>
            <Text style={styles.accuracyText}>
              Accuracy: ±3m
            </Text>
          </>
        )}

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={styles.currentLocationText}>Current Location</Text>
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
  map: {
    flex: 1,
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
    marginBottom: Spacing.sm,
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
