import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { Header } from '../../components/common/Header';
import { CustomButton } from '../../components/common/CustomButton';

type QRScannerNavigationProp = StackNavigationProp<MainStackParamList, 'QRScanner'>;

interface Props {
  navigation: QRScannerNavigationProp;
}

const QRScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    // Simulate QR code processing
    if (data.startsWith('HERB_') || data.includes('batch')) {
      Alert.alert(
        'QR Code Scanned',
        `Valid herb batch detected!\n\nData: ${data}`,
        [
          { text: 'Scan Another', onPress: () => setScanned(false) },
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      Alert.alert(
        'Invalid QR Code',
        'This QR code is not recognized as a valid herb batch code.',
        [
          { text: 'Try Again', onPress: () => setScanned(false) }
        ]
      );
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Header
          title="Scan QR Code"
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
          title="Scan QR Code"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centerContent}>
          <Ionicons name="qr-code-outline" size={60} color={Colors.gray400} />
          <Text style={styles.permissionText}>Camera permission required</Text>
          <Text style={styles.permissionSubtext}>
            Please enable camera access in settings to scan QR codes
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Scan QR Code"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={toggleFlash}>
            <Ionicons 
              name={flashOn ? "flash" : "flash-outline"} 
              size={24} 
              color={Colors.white} 
            />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.scannerContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
          enableTorch={flashOn}
          barcodeScannerSettings={{
            barcodeTypes: ['qr']
          }}
        />
        
        {/* Scanner overlay */}
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}>
            <View style={styles.unfocusedArea} />
          </View>
          
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedArea} />
            <View style={styles.focusedContainer}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
            <View style={styles.unfocusedArea} />
          </View>
          
          <View style={styles.unfocusedContainer}>
            <View style={styles.unfocusedArea} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Position QR code within the frame
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => {/* Handle gallery selection */}}
          >
            <Ionicons name="images" size={24} color={Colors.white} />
            <Text style={styles.controlText}>From Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={toggleFlash}
          >
            <Ionicons 
              name={flashOn ? "flash" : "flash-outline"} 
              size={24} 
              color={Colors.white} 
            />
            <Text style={styles.controlText}>Toggle Flash</Text>
          </TouchableOpacity>
        </View>

        {scanned && (
          <View style={styles.scannedOverlay}>
            <CustomButton
              title="Scan Again"
              onPress={() => setScanned(false)}
              size="medium"
            />
          </View>
        )}
      </View>
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
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  unfocusedArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  focusedContainer: {
    flex: 1.5,
  },
  scanFrame: {
    flex: 1,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.white,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructions: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
  },
  controlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  controlText: {
    color: Colors.white,
    fontSize: Fonts.sizes.xs,
    marginTop: Spacing.xs,
    fontFamily: Fonts.medium,
  },
  scannedOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    alignItems: 'center',
  },
});

export default QRScannerScreen;
