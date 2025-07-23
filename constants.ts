
import { PackageInfo, AppColors } from './types';

export const INITIAL_PACKAGES: PackageInfo[] = [
    { id: 1, name: 'Solo74', features: ['Social Media', 'Free Calls'], details: '20+20GB/450 Local Min(1M)', price: 50, sellPrice: 60 },
    { id: 2, name: 'Solo99', features: ['Unlimited Social', '100 Int Mins'], details: '35+UNL/1000 Local Min(1M)', price: 62, sellPrice: 74 },
    { id: 3, name: 'Solo149', features: ['Unlimited Social', 'Free Roaming'], details: '59+UNL/ UNL Local Min(1M)', price: 90, sellPrice: 108 },
    { id: 4, name: 'Solo179', features: ['UNL Social', 'UNL Roaming', 'Free Device'], details: '79+UNL/UNL Local Min(1M)', price: 110, sellPrice: 132 },
    { id: 5, name: 'Solo199', features: ['Premium Access', 'Intl. Calls'], details: '80+UNL/1800 Local Min(1M)', price: 120, sellPrice: 144 },
    { id: 6, name: 'Solo iNfinity', features: ['Truly Unlimited', 'VIP Support'], details: 'UNL Data+MiN+SMS (1M)', price: 210, sellPrice: 252 },
    { id: 7, name: 'Solo160', features: ['2-Month Contract', '5G Speed'], details: '50+UNL/1000 Local Min(2M)', price: 98, sellPrice: 118 },
    { id: 8, name: 'Solo240', features: ['3-Month Contract', 'Extra Data'], details: '90+UNL/1000 Local Min(3M)', price: 142, sellPrice: 170 },
    { id: 9, name: 'Solo340', features: ['4-Month Contract', 'Family Share'], details: '135+UNL/1500 Local Min(4M)', price: 208, sellPrice: 250 },
];

export const INITIAL_TABLE_HEADERS: string[] = ['Package', 'Features', 'Data+Minutes', 'Buy Price', 'Sell Price'];

export const DEFAULT_COLORS: AppColors = {
    primary: '#16a34a',     // Original: green-600
    tableHeader: '#2563eb', // Original: blue-600 (from gradient)
    headerText: '#ffffff',  // Original: white
    priceText: '#0d9488',   // Original: teal-600
    tableGradientFrom: '#f0fdf4', // Tailwind green-50
    tableGradientVia: '#eff6ff',   // Tailwind blue-50
    tableGradientTo: '#f5f3ff',    // Tailwind purple-50
    packageText: '#1f2937', // Tailwind gray-800
    detailsText: '#4b5563', // Tailwind gray-600
};
