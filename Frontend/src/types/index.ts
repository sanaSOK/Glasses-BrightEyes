export type Role = 'SUPER_ADMIN' | 'WHOLESALER' | 'RETAILER';

export type ProductType =
  | 'FRAME'
  | 'SUNGLASSES'
  | 'CONTACT_LENS'
  | 'OPTICAL_LENS'
  | 'ACCESSORY'
  | 'EQUIPMENT'
  | 'OTHER';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_DELIVERY'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED';

export type DeliveryMethod = 'DELIVERY' | 'SELF_PICKUP';
export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt: string;
  wholesaler?: Wholesaler;
  retailer?: Retailer;
}

export interface Wholesaler {
  id: string;
  userId: string;
  companyName: string;
  businessAddress: string;
  province: string;
  district: string;
  phone: string;
  email?: string;
  logoUrl?: string;
  description?: string;
  status: string;
  createdAt: string;
  _count?: {
    products?: number;
    orders?: number;
  };
}

export interface Retailer {
  id: string;
  userId: string;
  storeName: string;
  storeAddress: string;
  province: string;
  district: string;
  phone: string;
  email?: string;
  createdAt: string;
  stores?: Store[];
}

export interface Store {
  id: string;
  retailerId: string;
  storeName: string;
  address: string;
  province: string;
  district: string;
  phone: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  _count?: {
    products?: number;
  };
}

export interface Inventory {
  id: string;
  productId: string;
  product?: Product;
  wholesalerId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  stockStatus: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  SKU: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: ProductCategory;
  wholesalerId: string;
  wholesaler?: Wholesaler;
  brand: string;
  productType: ProductType;
  model?: string;
  color?: string;
  size?: string;
  material?: string;
  gender?: string;
  price: number;
  wholesalePrice: number;
  status: ProductStatus;
  createdAt: string;
  images?: ProductImage[];
  inventory?: Inventory;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  availableStock?: number;
  isStockSufficient?: boolean;
}

export interface Cart {
  id: string;
  retailerId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  SKU: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  province: string;
  district: string;
  commune?: string;
  phone: string;
  trackingNumber?: string;
  status: DeliveryStatus;
}

export interface Order {
  id: string;
  orderNumber: string;
  retailerId: string;
  retailer?: Retailer;
  wholesalerId: string;
  wholesaler?: Wholesaler;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderStatus: OrderStatus;
  shippingAddress: string;
  province: string;
  district: string;
  commune?: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  delivery?: Delivery;
}

export interface RetailerInventoryItem {
  id: string;
  retailerId: string;
  productId: string;
  product: Product;
  quantity: number;
  lastUpdated: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
