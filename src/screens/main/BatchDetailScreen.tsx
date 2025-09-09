import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../types/navigation';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { Header } from '../../components/common/Header';
import { CustomButton } from '../../components/common/CustomButton';

type BatchDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'BatchDetail'>;
type BatchDetailScreenRouteProp = RouteProp<MainStackParamList, 'BatchDetail'>;

interface Props {
  navigation: BatchDetailScreenNavigationProp;
  route: BatchDetailScreenRouteProp;
}

interface TimelineStep {
  id: string;
  title: string;
  completed: boolean;
  inProgress: boolean;
  date?: string;
}

const timelineSteps: TimelineStep[] = [
  { id: '1', title: 'Collected', completed: true, inProgress: false, date: 'Sep 1, 2025' },
  { id: '2', title: 'Verified', completed: true, inProgress: false, date: 'Sep 1, 2025' },
  { id: '3', title: 'Processing', completed: false, inProgress: true, date: undefined },
  { id: '4', title: 'Quality Test', completed: false, inProgress: false, date: undefined },
  { id: '5', title: 'Packaging', completed: false, inProgress: false, date: undefined },
];

const BatchDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { batchId } = route.params;

  const batchDetails = {
    id: batchId,
    species: 'Ashwagandha',
    date: 'Sep 1, 2025',
    location: 'Rajasthan',
    quantity: '25 kg',
    weather: 'Clear, 25°C',
    farmer: 'Rajesh Kumar',
    estimatedValue: '₹1,250',
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out my herb collection: ${batchDetails.species}, ${batchDetails.quantity} from ${batchDetails.location}. Batch ID: ${batchDetails.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderTimelineStep = (step: TimelineStep, index: number) => {
    const isLast = index === timelineSteps.length - 1;
    
    return (
      <View key={step.id} style={styles.timelineStep}>
        <View style={styles.timelineIndicator}>
          <View style={[
            styles.timelineCircle,
            step.completed && styles.timelineCircleCompleted,
            step.inProgress && styles.timelineCircleInProgress,
          ]}>
            {step.completed && (
              <Ionicons name="checkmark" size={12} color={Colors.white} />
            )}
            {step.inProgress && (
              <View style={styles.timelineProgress} />
            )}
          </View>
          {!isLast && <View style={styles.timelineLine} />}
        </View>
        
        <View style={styles.timelineContent}>
          <Text style={[
            styles.timelineTitle,
            step.completed && styles.timelineTitleCompleted,
            step.inProgress && styles.timelineTitleInProgress,
          ]}>
            {step.title}
          </Text>
          {step.date && (
            <Text style={styles.timelineDate}>{step.date}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={`Batch ${batchId}`}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Status Timeline</Text>
          <View style={styles.timeline}>
            {timelineSteps.map(renderTimelineStep)}
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Collection Details:</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Species:</Text>
            <Text style={styles.detailValue}>{batchDetails.species}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{batchDetails.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{batchDetails.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.detailValue}>{batchDetails.quantity}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weather:</Text>
            <Text style={styles.detailValue}>{batchDetails.weather}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Value:</Text>
            <Text style={[styles.detailValue, styles.valueHighlight]}>
              {batchDetails.estimatedValue}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <CustomButton
            title="View on Map"
            onPress={() => navigation.navigate('MapView', { 
              coordinates: { 
                latitude: 26.9124, // Rajasthan coordinates
                longitude: 75.7873 
              } 
            })}
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
          
          <CustomButton
            title="QR Code"
            onPress={() => navigation.navigate('QRScanner')}
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
        </View>

        <CustomButton
          title="Share Batch Details"
          onPress={handleShare}
          size="large"
          style={styles.shareButton}
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
  timelineCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
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
  timeline: {
    paddingLeft: Spacing.sm,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  timelineCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCircleCompleted: {
    backgroundColor: Colors.success,
  },
  timelineCircleInProgress: {
    backgroundColor: Colors.warning,
  },
  timelineProgress: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: Colors.gray300,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineTitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    fontFamily: Fonts.medium,
  },
  timelineTitleCompleted: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  timelineTitleInProgress: {
    color: Colors.warning,
    fontWeight: '500',
  },
  timelineDate: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  detailLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    fontFamily: Fonts.medium,
  },
  detailValue: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
  valueHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  shareButton: {
    marginBottom: Spacing.xl,
  },
});

export default BatchDetailScreen;
