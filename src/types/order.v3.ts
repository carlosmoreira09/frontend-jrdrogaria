/**
 * Order Types v3 - Multi-tenant
 * Usa quantity singular em vez de quantities objeto
 */

export type OrderStatus = 'draft' | 'confirmed' | 'sent' | 'delivered';

export interface PurchaseOrderItemV3 {
  id: number;
  productId?: number;
  product?: {
    id: number;
    product_name: string;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrderV3 {
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
  items: PurchaseOrderItemV3[];
  created_at?: string;
}

export interface CreateOrderPayloadV3 {
  quotationId: number;
  supplierId: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateOrderItemsPayloadV3 {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export type { OrderStatus as OrderStatusV3 };
export type { PurchaseOrderV3 as PurchaseOrder };
export type { PurchaseOrderItemV3 as PurchaseOrderItem };
export type { CreateOrderPayloadV3 as CreateOrderPayload };
