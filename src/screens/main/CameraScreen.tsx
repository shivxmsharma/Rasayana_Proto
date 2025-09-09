import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { Header } from '../../components/common/Header';
import { CustomButton } from '../../components/common/CustomButton';

type CameraScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Camera'>;

interface Props {
  navigation: CameraScreenNavigationProp;
}

const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>('back');
  const [photos, setPhotos] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const maxPhotos = 5;

  React.useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takePicture = async () => {
    if (cameraRef.current && photos.length < maxPhotos) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotos(prev => [...prev, photo.uri]);
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleDone = () => {
    if (photos.length === 0) {
      Alert.alert('Warning', 'Please take at least one photo before proceeding');
      return;
    }
    
    Alert.alert(
      'Success',
      `${photos.length} photo(s) saved successfully!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Header
          title="Collection Photos"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centerContent}>
          <Text>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Header
          title="Collection Photos"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centerContent}>
          <Ionicons name="camera-outline" size={60} color={Colors.gray400} />
          <Text style={styles.permissionText}>Camera permission required</Text>
          <Text style={styles.permissionSubtext}>
            Please enable camera access in settings to take photos
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Collection Photos"
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing={type} 
          ref={cameraRef}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.topOverlay}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => {
                  setType(
                    type === 'back' ? 'front' : 'back'
                  );
                }}
              >
                <Ionicons name="camera-reverse" size={30} color={Colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.bottomOverlay}>
              <View style={styles.photoProgress}>
                <Text style={styles.progressText}>
                  Photos taken: {photos.length}/{maxPhotos}
                </Text>
                <View style={styles.progressDots}>
                  {Array.from({ length: maxPhotos }, (_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.progressDot,
                        i < photos.length && styles.progressDotFilled
                      ]}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.galleryButton}
                  onPress={() => {/* Handle gallery */}}
                >
                  <Ionicons name="images" size={30} color={Colors.white} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.captureButton,
                    photos.length >= maxPhotos && styles.captureButtonDisabled
                  ]}
                  onPress={takePicture}
                  disabled={photos.length >= maxPhotos}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDone}
                >
                  <Ionicons name="checkmark" size={30} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </CameraView>
      </View>

      {photos.length > 0 && (
        <View style={styles.photoPreview}>
          <Text style={styles.previewTitle}>Recent Photos:</Text>
          <View style={styles.photoList}>
            {photos.slice(-3).map((photo, index) => (
              <TouchableOpacity
                key={index}
                style={styles.photoItem}
                onPress={() => removePhoto(photos.length - 3 + index)}
              >
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="image" size={20} color={Colors.gray400} />
                </View>
                <Ionicons 
                  name="close-circle" 
                  size={16} 
                  color={Colors.error}
                  style={styles.removePhoto}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  permissionText: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  photoProgress: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    marginBottom: Spacing.sm,
  },
  progressDots: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
  },
  progressDotFilled: {
    backgroundColor: Colors.white,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
  },
  doneButton: {
    backgroundColor: Colors.success,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  previewTitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  photoList: {
    flexDirection: 'row',
  },
  photoItem: {
    marginRight: Spacing.sm,
    position: 'relative',
  },
  photoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhoto: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
});

export default CameraScreen;
