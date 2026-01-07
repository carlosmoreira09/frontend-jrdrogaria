export type QuotationStatus = 'draft' | 'open' | 'closed' | 'completed';
export type SupplierQuotationStatus = 'pending' | 'in_progress' | 'submitted';

export type PharmacyQuantities = {
  JR: number;
  GS: number;
  BARAO: number;
  LB: number;
};

export interface QuotationItem {
  id?: number;
  productId: number;
  productName?: string;
  quantities: PharmacyQuantities;
  totalQuantity?: number;
  product?: {
    id: number;
    product_name: string;
  };
}

export interface QuotationRequest {
  id: number;
  name: string;
  status: QuotationStatus;
  deadline?: string;
  items?: QuotationItem[];
  supplierQuotations?: SupplierQuotation[];
  created_at?: string;
  updated_at?: string;
}

export interface SupplierQuotation {
  id: number;
  accessToken: string;
  status: SupplierQuotationStatus;
  submitted_at?: string;
  supplier?: {
    id: number;
    supplier_name: string;
  };
  quotationRequest?: QuotationRequest;
}

export interface CreateQuotationPayload {
  name: string;
  deadline?: string;
  items?: QuotationItem[];
}

export interface GenerateLinksPayload {
  supplierIds: number[];
}

export interface SupplierPriceEntry {
  supplierId: number;
  supplierName: string;
  unitPrice: number | null;
  available: boolean;
  observation?: string;
  totalPrice: number | null;
}

export interface PriceComparison {
  productId: number;
  productName: string;
  totalQuantity: number;
  quantities: PharmacyQuantities;
  prices: SupplierPriceEntry[];
  bestPrice: {
    supplierId: number;
    supplierName: string;
    unitPrice: number;
    totalPrice: number;
    savings: number;
  } | null;
}

export interface SupplierTotal {
  supplierId: number;
  supplierName: string;
  totalValue: number;
  productsWithBestPrice: number;
  productsQuoted: number;
}

export interface ComparisonSummary {
  quotationId: number;
  quotationName: string;
  totalProducts: number;
  respondedSuppliers: number;
  totalSuppliers: number;
  comparisons: PriceComparison[];
  supplierTotals: SupplierTotal[];
  maxSavings: number;
}

export interface BestPrice {
  productId: number;
  productName: string;
  totalQuantity: number;
  quantities: PharmacyQuantities;
  bestSupplier: string;
  bestSupplierId: number;
  unitPrice: number;
  totalPrice: number;
}
