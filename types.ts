
export interface PackageInfo {
    id: number;
    name: string;
    features: string[];
    details: string;
    price: number;
    sellPrice: number;
}

export interface AppColors {
  primary: string;
  tableHeader: string;
  headerText: string;
  priceText: string;
  tableGradientFrom: string;
  tableGradientVia: string;
  tableGradientTo: string;
  packageText: string;
  detailsText: string;
}
