/**
 * Dummy Data
 * 
 * This file contains fake data for testing the UI.
 * Replace this with real API calls when backend is ready.
 */

import { CategoryType } from './categories';

/**
 * Document interface - defines the shape of a document object
 * This matches what your backend will return later
 */
export interface Document {
  id: string;
  title: string;
  category: CategoryType;
  tags: string[];
  dateAdded: string; // ISO date string
  thumbnailUrl: string; // Image URL
  summary: string;
  expiryDate?: string; // Optional - only for warranties, insurance, etc.
  isSensitive?: boolean; // Whether document is marked sensitive
  uploadedBy?: string; // User name (for family sharing)
  metadata?: {
    vendor?: string;
    amount?: string;
    warranty?: string;
    [key: string]: any; // Other dynamic fields
  };
  extractedText?: string; // Full OCR text (truncated in list view)
}

/**
 * Dummy documents for testing
 * These will appear in your document list
 */
export const DUMMY_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Samsung Refrigerator Receipt',
    category: 'receipt',
    tags: ['appliance', 'kitchen', 'best buy'],
    dateAdded: '2024-01-15T10:30:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
    summary: 'Purchase receipt for Samsung RF28R7351SR refrigerator from Best Buy. Total amount $1,299.99. Includes extended warranty until January 2027.',
    expiryDate: '2027-01-15',
    metadata: {
      vendor: 'Best Buy',
      amount: '$1,299.99',
      warranty: '3 years',
    },
    extractedText: 'BEST BUY\nStore #1234\nDate: 01/15/2024\n\nSamsung RF28R7351SR Refrigerator\nPrice: $1,299.99\nExtended Warranty: $199.99\nTotal: $1,499.98...',
  },
  {
    id: '2',
    title: 'Annual Physical Exam Results',
    category: 'medical',
    tags: ['health', 'checkup', 'dr. smith'],
    dateAdded: '2024-03-20T14:15:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400',
    summary: 'Annual physical examination results from Dr. Smith. All vital signs normal. Blood work shows healthy levels. Next checkup recommended in 12 months.',
    isSensitive: true,
    metadata: {
      doctor: 'Dr. Sarah Smith',
      facility: 'City Medical Center',
    },
    extractedText: 'PATIENT: John Doe\nDATE: 03/20/2024\nPHYSICIAN: Dr. Sarah Smith\n\nVITAL SIGNS:\nBlood Pressure: 120/80\nHeart Rate: 72 bpm...',
  },
  {
    id: '3',
    title: 'Home Insurance Policy',
    category: 'insurance',
    tags: ['home', 'property', 'state farm'],
    dateAdded: '2024-02-01T09:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
    summary: 'Home insurance policy from State Farm. Coverage includes property damage, theft, and liability. Policy renews annually on February 1st.',
    expiryDate: '2025-02-01',
    uploadedBy: 'Sarah (Wife)',
    metadata: {
      provider: 'State Farm',
      policyNumber: 'HSI-123456789',
      coverage: '$350,000',
    },
    extractedText: 'STATE FARM INSURANCE\nPolicy Number: HSI-123456789\nEffective Date: 02/01/2024\nExpiration Date: 02/01/2025...',
  },
  {
    id: '4',
    title: '2023 Tax Return Documents',
    category: 'tax',
    tags: ['taxes', '2023', 'irs', 'federal'],
    dateAdded: '2024-04-10T16:45:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224311-beee460c201a?w=400',
    summary: 'Federal tax return for 2023 tax year. Filed jointly with spouse. Includes W-2 forms, 1099 forms, and itemized deductions.',
    isSensitive: true,
    metadata: {
      year: '2023',
      status: 'Filed',
    },
    extractedText: 'Form 1040 - U.S. Individual Income Tax Return\nTax Year: 2023\nFiling Status: Married Filing Jointly...',
  },
  {
    id: '5',
    title: 'MacBook Pro Warranty',
    category: 'warranty',
    tags: ['electronics', 'apple', 'laptop'],
    dateAdded: '2023-11-05T11:20:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    summary: 'AppleCare+ warranty for MacBook Pro 14-inch. Includes accidental damage protection. Coverage expires November 2026.',
    expiryDate: '2026-11-05',
    metadata: {
      product: 'MacBook Pro 14"',
      serialNumber: 'C02XY1234567',
      warranty: 'AppleCare+ (3 years)',
    },
    extractedText: 'APPLECARE+ COVERAGE\nProduct: MacBook Pro 14-inch\nSerial Number: C02XY1234567\nPurchase Date: 11/05/2023...',
  },
  {
    id: '6',
    title: 'Electric Bill - March 2024',
    category: 'receipt',
    tags: ['utility', 'electricity', 'monthly'],
    dateAdded: '2024-03-01T08:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400',
    summary: 'Monthly electric bill from City Power & Light. Usage: 850 kWh. Amount due: $127.45. Due date: March 25, 2024.',
    metadata: {
      provider: 'City Power & Light',
      amount: '$127.45',
      usage: '850 kWh',
    },
  },
  {
    id: '7',
    title: 'Car Registration Renewal',
    category: 'legal',
    tags: ['vehicle', 'dmv', 'registration'],
    dateAdded: '2024-01-20T13:30:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
    summary: 'Vehicle registration renewal notice for 2024 Honda Accord. Registration expires June 30, 2024. Renewal fee: $85.',
    expiryDate: '2024-06-30',
    metadata: {
      vehicle: '2024 Honda Accord',
      plate: 'ABC1234',
      fee: '$85',
    },
  },
  {
    id: '8',
    title: "Kids' Vaccination Records",
    category: 'medical',
    tags: ['children', 'immunization', 'school'],
    dateAdded: '2024-02-14T10:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
    summary: 'Complete vaccination records for Emma and Jake. All required immunizations up to date. Needed for school enrollment.',
    isSensitive: true,
    uploadedBy: 'Sarah (Wife)',
    metadata: {
      children: 'Emma, Jake',
      facility: 'Children\'s Health Clinic',
    },
  },
];

/**
 * Helper to get recent documents (for "Recently Added" section)
 */
export const getRecentDocuments = (count: number = 5): Document[] => {
  return DUMMY_DOCUMENTS
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, count);
};

/**
 * Helper to get expiring documents (for notifications/alerts)
 */
export const getExpiringDocuments = (daysAhead: number = 30): Document[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return DUMMY_DOCUMENTS.filter(doc => {
    if (!doc.expiryDate) return false;
    const expiryDate = new Date(doc.expiryDate);
    return expiryDate >= now && expiryDate <= futureDate;
  }).sort((a, b) => 
    new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()
  );
};

/**
 * Helper to filter documents by category
 */
export const getDocumentsByCategory = (category: CategoryType): Document[] => {
  return DUMMY_DOCUMENTS.filter(doc => doc.category === category);
};