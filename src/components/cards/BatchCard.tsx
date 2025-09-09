import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export interface BatchData {
  id: string;
  species: string;
  quantity: string;
  status: 'active' | 'processing' | 'testing' | 'completed';
  date: string;
  estimatedValue: string;
}

interface BatchCardProps {
  batch: BatchData;
  onPress: () => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({ batch, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'processing': return Colors.warning;
      case 'testing': return Colors.info;
      case 'completed': return Colors.gray500;
      default: return Colors.gray300;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'leaf';
      case 'processing': return 'time';
      case 'testing': return 'flask';
      case 'completed': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'processing': return 'Processing';
      case 'testing': return 'Testing';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.batchId}>{batch.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(batch.status) }]}>
          <Ionicons 
            name={getStatusIcon(batch.status) as any} 
            size={12} 
            color={Colors.white} 
          />
          <Text style={styles.statusText}>{getStatusText(batch.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.species}>{batch.species} • {batch.quantity}</Text>
      <Text style={styles.date}>{batch.date}</Text>
      <Text style={styles.value}>{batch.estimatedValue} estimated</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  batchId: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.white,
    marginLeft: 4,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
  species: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
});
