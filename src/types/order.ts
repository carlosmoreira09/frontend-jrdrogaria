import { PharmacyQuantities } from "./quotation";

export type OrderStatus = "draft" | "confirmed" | "sent" | "delivered";

export interface PurchaseOrderItem {
  id: number;
  productId?: number;
  productName?: string;
  product?: {
    id: number;
    product_name: string;
  };
  quantities: PharmacyQuantities;
  orderQuantity?: number;
  targetStore?: string;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalValue: number;
  supplier?: {
    id: number;
    supplier_name: string;
  };
  quotationRequest?: {
    id: number;
    name: string;
  };
  items: PurchaseOrderItem[];
  created_at?: string;
}

export interface CreateOrderPayload {
  quotationId: number;
  supplierId: number;
  items: {
    productId: number;
    quantities: PharmacyQuantities;
    unitPrice: number;
  }[];
}

export interface UpdateOrderItemsPayload {
  items: {
    productId: number;
    quantities: PharmacyQuantities;
  }[];
}

export interface OrderItemConfig {
  productId: number;
  quantity: number;
  supplierId: number;
  supplierName: string;
  unitPrice: number;
  targetStore?: string;
}
