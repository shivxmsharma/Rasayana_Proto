import { BatchData } from '../components/cards/BatchCard';

export const mockBatches: BatchData[] = [
  {
    id: 'ASH001',
    species: 'Ashwagandha',
    quantity: '25kg',
    status: 'active',
    date: 'Sep 1, 2025',
    estimatedValue: '₹1,250',
  },
  {
    id: 'TUR002',
    species: 'Turmeric',
    quantity: '18kg',
    status: 'processing',
    date: 'Sep 2, 2025',
    estimatedValue: '₹900',
  },
  {
    id: 'BRA003',
    species: 'Brahmi',
    quantity: '12kg',
    status: 'testing',
    date: 'Aug 28, 2025',
    estimatedValue: '₹800',
  },
];

export const mockStats = {
  batches: 3,
  earnings: '₹1,240',
  quality: '94%',
  totalBatches: 45,
  thisMonth: 12,
  successRate: '94%',
  totalEarnings: '₹45,600',
};
