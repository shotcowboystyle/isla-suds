export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface WholesaleOrder {
  id: string;
  name: string;
  orderNumber: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  currentTotalPrice: MoneyV2;
}

export interface ProductVariant {
  id: string;
  title: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
}

export interface LineItem {
  id: string;
  title: string;
  quantity: number;
  variant: ProductVariant | null;
  originalTotalPrice: MoneyV2;
  discountedTotalPrice: MoneyV2;
}

export interface LineItemEdge {
  node: LineItem;
}

export interface ShippingAddress {
  formatted: string[];
}

export interface WholesaleOrderDetail extends WholesaleOrder {
  subtotalPrice: MoneyV2;
  totalTax: MoneyV2;
  shippingCost: MoneyV2;
  lineItems: {
    edges: LineItemEdge[];
  };
  shippingAddress: ShippingAddress | null;
}

export interface OrderEdge {
  cursor: string;
  node: WholesaleOrder;
}

export interface OrdersResponse {
  data: {
    customer: {
      orders: {
        edges: OrderEdge[];
        pageInfo: PageInfo;
      };
    };
  };
}

export interface OrderDetailsResponse {
  data: {
    order: WholesaleOrderDetail | null;
  };
}

export interface EmailLineItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
  } | null;
}

export interface EmailOrder {
  id: string;
  name: string;
  orderNumber: string;
  processedAt: string;
  fulfillmentStatus: string;
  currentTotalPrice: MoneyV2;
  lineItems: {
    edges: Array<{node: EmailLineItem}>;
  };
}

export interface EmailCustomer {
  firstName: string | null;
  lastName: string | null;
  email: string;
  company?: {
    name: string;
  } | null;
}
