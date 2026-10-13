import { api } from './api';

export interface Brand {
  id: string;
  name: string;
  code?: string;
  description?: string;
  logoUrl?: string;
  _count?: { lensProducts: number };
}

export interface LensVariant {
  id: string;
  lensProductId: string;
  sphere: number;
  cylinder?: number | null;
  addPower?: number | null;
  eyeSide?: string | null;
  sku: string;
  code?: string | null;
  quantity: number;
  quantityR?: number;
  quantityL?: number;
  costPrice: number;
  sellingPrice: number;
  minStock: number;
  maxStock: number;
  cellColor?: string | null;
}

export interface LensProduct {
  id: string;
  SKU: string;
  name: string;
  description?: string;
  brandId: string;
  brand: Brand;
  lensType: 'Contact Lens' | 'Single Vision' | 'Bifocal' | 'Progressive' | 'Sunglass' | string;
  refractiveIndex?: number | null;
  coating?: string | null;
  material?: string | null;
  designType?: string | null;
  tintColor?: string | null;
  uvProtection?: string | null;
  isPolarized: boolean;
  antiGlare: boolean;
  antiBlueLight: boolean;
  scratchResistant: boolean;
  emi: boolean;
  waterResistant: boolean;
  myopiaControl: boolean;
  baseCurve?: number | null;
  diameter?: number | null;
  waterContent?: string | null;
  usageType?: string | null;
  price: number;
  costPrice: number;
  variants?: LensVariant[];
  _count?: { variants: number };
}

export interface LensOrder {
  id: string;
  invoiceNumber: string;
  customerName?: string;
  customerPhone?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  notes?: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    productName: string;
    sphere?: number;
    cylinder?: number;
    addPower?: number;
    eyeSide?: string;
    axis?: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

export interface OrderFrame {
  id?: string;
  orderId?: string;
  frameShape?: string;
  tracerFlag?: string;
  frameWidthA?: number | null;
  frameHeightB?: number | null;
  effectiveDiaEd?: number | null;
  noseBridgeDbl?: number | null;
  faceFormAngle?: number | null;
  pantoscopicTilt?: number | null;
  refractedBvd?: number | null;
  fittedBvd?: number | null;
  baseCurve?: number | null;
  frameType?: string | null;
  vd?: number | null;
  tilt?: number | null;
  wrap?: number | null;
  pdFarR?: number | null;
  pdFarL?: number | null;
  pdNearR?: number | null;
  pdNearL?: number | null;
  heightR?: number | null;
  heightL?: number | null;
}

export interface OrderLensItem {
  id?: string;
  orderId?: string;
  lensType?: string;
  productName: string;
  designType?: string;
  refractiveIndex?: number | null;
  material?: string;
  tintingType?: string;
  tintColor?: string | null;
  tintFrom?: string | null;
  tintTo?: string | null;
  gradationPoint?: string | null;
  coating?: string;
  treatments?: string;
  quantity: number;
  specialInstructions?: string | null;
  eyeSide?: 'Right' | 'Left' | 'PAIR' | string;
  sphere?: number | null;
  cylinder?: number | null;
  axis?: number | null;
  addition?: number | null;
  diameter?: number | null;
  dpd?: number | null;
  npd?: number | null;
  hPrism?: number | null;
  hBase?: string | null;
  vPrism?: number | null;
  vBase?: string | null;
  fh?: number | null;
  remarks?: string | null;
  unitPrice: number;
  subtotal: number;
}

export interface UnifiedLensOrder {
  id: string;
  orderNo: string;
  orderRef?: string | null;
  orderType: 'RX Lab Order' | 'Stock Lens Order' | 'Remote Edging' | string;
  buyer?: string | null;
  shop?: string | null;
  orderingPerson?: string | null;
  patientName?: string | null;
  patientCode?: string | null;
  trayId?: string | null;
  orderStatus: 'Pending' | 'Producing Surfacing' | 'Coating / Tinting' | 'Quality Check' | 'Ready for Dispatch' | 'Shipped' | 'Delivered' | string;
  orderDate: string;
  logisticsDate?: string | null;
  isUrgent: boolean;
  accountCode?: string | null;
  notes?: string | null;
  totalAmount: number;
  totalPieces: number;
  frame?: OrderFrame | null;
  lensItems: OrderLensItem[];
  createdAt: string;
  updatedAt?: string;
}

export const lensService = {
  async getBrands(): Promise<Brand[]> {
    const res = await api.get('/lenses/brands');
    const d = res.data?.data !== undefined ? res.data.data : res.data;
    return Array.isArray(d) ? d : [];
  },

  async createBrand(brandData: Partial<Brand>): Promise<Brand> {
    const res = await api.post('/lenses/brands', brandData);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  async getProducts(lensType?: string, brandId?: string, search?: string): Promise<LensProduct[]> {
    const params: any = {};
    if (lensType && lensType !== 'All') params.lensType = lensType;
    if (brandId && brandId !== 'All') params.brandId = brandId;
    if (search) params.search = search;

    const res = await api.get('/lenses/products', { params });
    const d = res.data?.data !== undefined ? res.data.data : res.data;
    return Array.isArray(d) ? d : [];
  },

  async getProductById(id: string): Promise<LensProduct> {
    const res = await api.get(`/lenses/products/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  async createProduct(productData: any): Promise<LensProduct> {
    const res = await api.post('/lenses/products', productData);
    return res.data?.data || res.data;
  },

  async updateProduct(id: string, productData: any): Promise<LensProduct> {
    const res = await api.put(`/lenses/products/${id}`, productData);
    return res.data?.data || res.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/lenses/products/${id}`);
  },

  async updateVariantCell(variantId: string, cellData: Partial<LensVariant>): Promise<LensVariant> {
    const res = await api.patch(`/lenses/variants/${variantId}`, cellData);
    return res.data?.data || res.data;
  },

  async batchUpdateVariants(batchData: {
    variantIds?: string[];
    lensProductId?: string;
    brandId?: string;
    minSphere?: number;
    maxSphere?: number;
    minCol?: number;
    maxCol?: number;
    quantity?: number;
    costPrice?: number;
    sellingPrice?: number;
    cellColor?: string;
  }): Promise<{ updatedCount: number }> {
    const res = await api.post('/lenses/variants/batch-update', batchData);
    return res.data?.data || res.data;
  },

  async createOrder(orderData: {
    customerName?: string;
    customerPhone?: string;
    discount?: number;
    notes?: string;
    items: Array<{
      lensProductId: string;
      variantId?: string;
      productName: string;
      sphere?: number;
      cylinder?: number;
      addPower?: number;
      eyeSide?: string;
      axis?: number;
      quantity: number;
      unitPrice: number;
    }>;
  }): Promise<LensOrder> {
    const res = await api.post('/lenses/orders', orderData);
    return res.data?.data || res.data;
  },

  async getOrders(): Promise<LensOrder[]> {
    const res = await api.get('/lenses/orders');
    return res.data?.data || res.data;
  },

  // -----------------------------------------------------------------------
  // UNIFIED LENS ORDERS & RX LAB WIZARD API
  // -----------------------------------------------------------------------
  async getUnifiedOrders(query?: any): Promise<UnifiedLensOrder[]> {
    try {
      const res = await api.get('/lenses/unified-orders', { params: query });
      const d = res.data?.data !== undefined ? res.data.data : res.data;
      if (Array.isArray(d)) return d;
    } catch {}
    // Local persistence fallback
    const local = localStorage.getItem('brighteyes_unified_orders');
    return local ? JSON.parse(local) : [];
  },

  async getUnifiedOrderById(id: string): Promise<UnifiedLensOrder> {
    const res = await api.get(`/lenses/unified-orders/${id}`);
    return res.data?.data || res.data;
  },

  async createUnifiedOrder(orderData: Partial<UnifiedLensOrder>): Promise<UnifiedLensOrder> {
    try {
      const res = await api.post('/lenses/unified-orders', orderData);
      const created = res.data?.data || res.data;
      if (created) return created;
    } catch {}
    
    // Fallback simulation
    const id = `ord-${Date.now()}`;
    const orderNo = orderData.orderNo || `${orderData.orderType === 'Stock Lens Order' ? 'STK' : 'RX'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrd: UnifiedLensOrder = {
      id,
      orderNo,
      orderRef: orderData.orderRef || null,
      orderType: orderData.orderType || 'RX Lab Order',
      buyer: orderData.buyer || 'Direct Optical Shop',
      shop: orderData.shop || 'Central Lab',
      orderingPerson: orderData.orderingPerson || 'Optometrist',
      patientName: orderData.patientName || 'Customer Rx',
      patientCode: orderData.patientCode || `PAT-${Date.now().toString().slice(-6)}`,
      trayId: orderData.trayId || `TRAY-${Math.floor(10 + Math.random() * 90)}`,
      orderStatus: orderData.orderStatus || 'Producing Surfacing',
      orderDate: orderData.orderDate || new Date().toISOString(),
      logisticsDate: orderData.logisticsDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      isUrgent: orderData.isUrgent || false,
      accountCode: orderData.accountCode || 'ACC-DEFAULT',
      notes: orderData.notes || null,
      totalAmount: orderData.totalAmount || 0,
      totalPieces: orderData.totalPieces || 0,
      frame: orderData.frame || null,
      lensItems: orderData.lensItems || [],
      createdAt: new Date().toISOString(),
    };

    const existing: UnifiedLensOrder[] = JSON.parse(localStorage.getItem('brighteyes_unified_orders') || '[]');
    existing.unshift(newOrd);
    localStorage.setItem('brighteyes_unified_orders', JSON.stringify(existing));
    return newOrd;
  },

  async updateUnifiedOrderStatus(id: string, status: string): Promise<UnifiedLensOrder> {
    const res = await api.patch(`/lenses/unified-orders/${id}/status`, { status });
    return res.data?.data || res.data;
  },

  async deleteUnifiedOrder(id: string): Promise<any> {
    const res = await api.delete(`/lenses/unified-orders/${id}`);
    return res.data?.data || res.data;
  },

  async getStockMatrixCatalog(category?: string, treatment?: string): Promise<any> {
    const res = await api.get('/lenses/stock-matrix', { params: { category, treatment } });
    return res.data?.data || res.data;
  },
};

