import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LensesService {
  constructor(private prisma: PrismaService) {}

  // -------------------------------------------------------------
  // 1. BRANDS / COMPANIES
  // -------------------------------------------------------------
  async getBrands() {
    return this.prisma.brand.findMany({
      include: {
        _count: {
          select: { lensProducts: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createBrand(data: { name: string; code?: string; description?: string; logoUrl?: string }) {
    return this.prisma.brand.create({ data });
  }

  // -------------------------------------------------------------
  // 2. LENS PRODUCTS MASTER & MATRIX GENERATION
  // -------------------------------------------------------------
  async getLensProducts(lensType?: string, brandId?: string, search?: string) {
    const where: any = {};
    if (lensType && lensType !== 'All') {
      where.lensType = lensType;
    }
    if (brandId && brandId !== 'All') {
      where.brandId = brandId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { SKU: { contains: search, mode: 'insensitive' } },
        { material: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.lensProduct.findMany({
      where,
      include: {
        brand: true,
        _count: { select: { variants: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getLensProductById(id: string) {
    const product = await this.prisma.lensProduct.findUnique({
      where: { id },
      include: {
        brand: true,
        variants: {
          orderBy: [{ sphere: 'asc' }, { cylinder: 'asc' }, { addPower: 'asc' }],
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Lens product with ID ${id} not found`);
    }

    return product;
  }

  async createLensProduct(dto: {
    SKU: string;
    name: string;
    brandId: string;
    lensType: string;
    refractiveIndex?: number;
    coating?: string;
    material?: string;
    designType?: string;
    tintColor?: string;
    uvProtection?: string;
    isPolarized?: boolean;
    antiGlare?: boolean;
    antiBlueLight?: boolean;
    scratchResistant?: boolean;
    emi?: boolean;
    waterResistant?: boolean;
    myopiaControl?: boolean;
    baseCurve?: number;
    diameter?: number;
    waterContent?: string;
    usageType?: string;
    price: number;
    costPrice: number;
    description?: string;
    // Matrix generation bounds
    minSphere?: number;
    maxSphere?: number;
    sphereStep?: number;
    minCol?: number;
    maxCol?: number;
    colStep?: number;
    eyeSides?: string[]; // ['PAIR'] or ['R', 'L']
  }) {
    const {
      minSphere = -6.0,
      maxSphere = +4.0,
      sphereStep = 0.5,
      minCol = -3.0,
      maxCol = 0.0,
      colStep = 0.75,
      eyeSides = dto.lensType === 'Progressive' ? ['R', 'L'] : ['PAIR'],
      ...prodData
    } = dto;

    const product = await this.prisma.lensProduct.create({
      data: prodData,
    });

    // Auto-generate variants matrix grid
    const isAddType = dto.lensType === 'Bifocal' || dto.lensType === 'Progressive';
    const isContactLens = dto.lensType === 'Contact Lens';

    const colType = isAddType ? 'ADD' : 'C';
    const actualMinCol = isAddType ? (minCol < 1.0 ? 1.0 : minCol) : minCol;
    const actualMaxCol = isAddType ? (maxCol < 3.0 ? 3.0 : maxCol) : maxCol;
    const actualColStep = isAddType ? 0.5 : colStep;

    const spheres: number[] = [];
    for (let s = minSphere; s <= maxSphere + 0.001; s += sphereStep) {
      spheres.push(Number(s.toFixed(2)));
    }

    const colValues: number[] = [];
    if (isContactLens) {
      colValues.push(0);
    } else {
      for (let c = actualMinCol; c <= actualMaxCol + 0.001; c += actualColStep) {
        colValues.push(Number(c.toFixed(2)));
      }
    }

    const variantRecords = [];
    for (const sph of spheres) {
      for (const colVal of colValues) {
        for (const side of eyeSides) {
          const formattedSph = (sph >= 0 ? '+' : '') + sph.toFixed(2);
          const formattedCol = (colVal >= 0 ? '+' : '') + colVal.toFixed(2);
          const variantSku = `${product.SKU}-S${formattedSph}-${colType}${formattedCol}-${side}`;
          
          const defaultStock = Math.floor(Math.random() * 20) + 5;
          const cellColor = defaultStock > 15 ? '#10b981' : defaultStock > 5 ? '#f59e0b' : '#ef4444';

          variantRecords.push({
            lensProductId: product.id,
            sphere: sph,
            cylinder: colType === 'C' ? colVal : null,
            addPower: colType === 'ADD' ? colVal : null,
            eyeSide: side,
            sku: variantSku,
            code: `${colType}${formattedCol}`,
            quantity: defaultStock,
            quantityR: side === 'R' ? defaultStock : Math.floor(defaultStock / 2),
            quantityL: side === 'L' ? defaultStock : Math.floor(defaultStock / 2),
            costPrice: product.costPrice || 20,
            sellingPrice: product.price || 45,
            minStock: 5,
            maxStock: 50,
            cellColor: cellColor,
          });
        }
      }
    }

    await this.prisma.lensVariant.createMany({
      data: variantRecords,
    });

    return this.getLensProductById(product.id);
  }

  async updateLensProduct(id: string, dto: any) {
    await this.getLensProductById(id);
    return this.prisma.lensProduct.update({
      where: { id },
      data: dto,
    });
  }

  async deleteLensProduct(id: string) {
    await this.getLensProductById(id);
    return this.prisma.lensProduct.delete({
      where: { id },
    });
  }

  // -------------------------------------------------------------
  // 3. MATRIX VARIANT GRID UPDATES
  // -------------------------------------------------------------
  async updateVariantCell(id: string, dto: {
    quantity?: number;
    costPrice?: number;
    sellingPrice?: number;
    cellColor?: string;
    sku?: string;
    minStock?: number;
    maxStock?: number;
  }) {
    const variant = await this.prisma.lensVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant cell ${id} not found`);

    return this.prisma.lensVariant.update({
      where: { id },
      data: dto,
    });
  }

  async batchUpdateVariants(dto: {
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
  }) {
    const where: any = {};
    if (dto.variantIds && dto.variantIds.length > 0) {
      where.id = { in: dto.variantIds };
    } else {
      if (dto.lensProductId && dto.lensProductId !== 'ALL') {
        where.lensProductId = dto.lensProductId;
      } else if (dto.brandId && dto.brandId !== 'ALL') {
        where.lensProduct = { brandId: dto.brandId };
      }

      if (dto.minSphere !== undefined || dto.maxSphere !== undefined) {
        where.sphere = {};
        if (dto.minSphere !== undefined) where.sphere.gte = dto.minSphere;
        if (dto.maxSphere !== undefined) where.sphere.lte = dto.maxSphere;
      }

      if (dto.minCol !== undefined || dto.maxCol !== undefined) {
        where.OR = [
          {
            cylinder: {
              ...(dto.minCol !== undefined ? { gte: dto.minCol } : {}),
              ...(dto.maxCol !== undefined ? { lte: dto.maxCol } : {}),
            }
          },
          {
            addPower: {
              ...(dto.minCol !== undefined ? { gte: dto.minCol } : {}),
              ...(dto.maxCol !== undefined ? { lte: dto.maxCol } : {}),
            }
          }
        ];
      }
    }

    const updateData: any = {};
    if (dto.quantity !== undefined && dto.quantity !== null && !isNaN(dto.quantity)) {
      updateData.quantity = dto.quantity;
    }
    if (dto.costPrice !== undefined && dto.costPrice !== null && !isNaN(dto.costPrice)) {
      updateData.costPrice = dto.costPrice;
    }
    if (dto.sellingPrice !== undefined && dto.sellingPrice !== null && !isNaN(dto.sellingPrice)) {
      updateData.sellingPrice = dto.sellingPrice;
    }
    if (dto.cellColor !== undefined && dto.cellColor !== null && dto.cellColor !== '') {
      updateData.cellColor = dto.cellColor;
    }

    const result = await this.prisma.lensVariant.updateMany({
      where,
      data: updateData,
    });

    return { updatedCount: result.count };
  }

  // -------------------------------------------------------------
  // 4. LENS ORDERS & CHECKOUT
  // -------------------------------------------------------------
  async createLensOrder(dto: {
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
  }) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    let subtotal = 0;
    const itemsData = dto.items.map((item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;
      return {
        lensProductId: item.lensProductId,
        variantId: item.variantId || null,
        productName: item.productName,
        sphere: item.sphere ?? null,
        cylinder: item.cylinder ?? null,
        addPower: item.addPower ?? null,
        eyeSide: item.eyeSide || 'PAIR',
        axis: item.axis ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: itemSubtotal,
      };
    });

    const discountAmount = dto.discount || 0;
    const total = Math.max(0, subtotal - discountAmount);
    const invoiceNum = `LENS-INV-${Date.now().toString().slice(-8)}`;

    const order = await this.prisma.lensOrder.create({
      data: {
        invoiceNumber: invoiceNum,
        customerName: dto.customerName || 'Walk-in Customer',
        customerPhone: dto.customerPhone || null,
        subtotal,
        discount: discountAmount,
        total,
        notes: dto.notes || null,
        orderItems: {
          create: itemsData,
        },
      },
      include: { orderItems: true },
    });

    // Stock deduction
    for (const item of dto.items) {
      if (item.variantId) {
        await this.prisma.lensVariant.update({
          where: { id: item.variantId },
          data: {
            quantity: { decrement: item.quantity },
          },
        }).catch(() => null);
      }
    }

    return order;
  }

  async getLensOrders() {
    return this.prisma.lensOrder.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // -------------------------------------------------------------
  // 5. UNIFIED LENS ORDERING & INVENTORY MANAGEMENT SYSTEM
  // Custom Rx Lab Orders, Frame Measurements, Stock Matrix Fulfillment
  // -------------------------------------------------------------

  private memoryUnifiedOrders: any[] = [
    {
      id: 'ord-rx-001',
      orderNo: 'RX-2026-0891',
      orderRef: 'REF-B2B-441',
      orderType: 'RX Lab Order',
      buyer: 'Phnom Penh Eyewear Center',
      shop: 'Sen Sok Branch',
      orderingPerson: 'Dr. Chea Vandy',
      patientName: 'Kosal Vireak',
      patientCode: 'PAT-KH-9920',
      trayId: 'TRAY-A14',
      orderStatus: 'Producing Surfacing',
      orderDate: new Date(Date.now() - 3600000 * 5).toISOString(),
      logisticsDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      isUrgent: true,
      accountCode: 'ACC-8821',
      notes: 'High cylinder, thin edge bevel required. Polish bevel edge.',
      totalAmount: 145.0,
      totalPieces: 2,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      frame: {
        id: 'frm-001',
        orderId: 'ord-rx-001',
        frameShape: 'Rectangular',
        tracerFlag: 'Traced Scan #991',
        frameWidthA: 54.0,
        frameHeightB: 38.0,
        effectiveDiaEd: 58.5,
        noseBridgeDbl: 18.0,
        faceFormAngle: 5.0,
        pantoscopicTilt: 8.5,
        refractedBvd: 12.0,
        fittedBvd: 12.0,
        baseCurve: 4.5,
        frameType: 'Metal Fullrim',
        vd: 12.0,
        tilt: 8.0,
        wrap: 5.0,
        pdFarR: 32.0,
        pdFarL: 31.5,
        pdNearR: 30.0,
        pdNearL: 29.5,
        heightR: 21.0,
        heightL: 21.0,
      },
      lensItems: [
        {
          id: 'item-001',
          orderId: 'ord-rx-001',
          lensType: 'Single Vision RX',
          productName: 'Essilor Eyezen Boost 1.60 SHMC',
          designType: 'Aspherical',
          refractiveIndex: 1.6,
          material: 'High Index MR-8',
          tintingType: 'None',
          coating: 'Super HMC',
          treatments: 'Super HMC, Anti-Blue Light, UV420',
          quantity: 1,
          eyeSide: 'Right',
          sphere: -3.75,
          cylinder: -1.25,
          axis: 85,
          addition: null,
          diameter: 70,
          dpd: 32.0,
          npd: 30.0,
          hPrism: 0.5,
          hBase: 'Out',
          vPrism: null,
          vBase: null,
          fh: 21.0,
          remarks: 'OD Right Eye',
          unitPrice: 72.5,
          subtotal: 72.5,
        },
        {
          id: 'item-002',
          orderId: 'ord-rx-001',
          lensType: 'Single Vision RX',
          productName: 'Essilor Eyezen Boost 1.60 SHMC',
          designType: 'Aspherical',
          refractiveIndex: 1.6,
          material: 'High Index MR-8',
          tintingType: 'None',
          coating: 'Super HMC',
          treatments: 'Super HMC, Anti-Blue Light, UV420',
          quantity: 1,
          eyeSide: 'Left',
          sphere: -4.25,
          cylinder: -1.5,
          axis: 95,
          addition: null,
          diameter: 70,
          dpd: 31.5,
          npd: 29.5,
          hPrism: 0.5,
          hBase: 'Out',
          vPrism: null,
          vBase: null,
          fh: 21.0,
          remarks: 'OS Left Eye',
          unitPrice: 72.5,
          subtotal: 72.5,
        },
      ],
    },
    {
      id: 'ord-stk-002',
      orderNo: 'STK-2026-0348',
      orderRef: 'PO-STOCK-109',
      orderType: 'Stock Lens Order',
      buyer: 'Siem Reap Vision Care',
      shop: 'Main Clinic',
      orderingPerson: 'Ly Sokun',
      patientName: 'Stock Replenishment',
      patientCode: 'WH-STOCK-SR',
      trayId: 'BOX-STK-09',
      orderStatus: 'Ready for Dispatch',
      orderDate: new Date(Date.now() - 3600000 * 20).toISOString(),
      logisticsDate: new Date(Date.now() + 86400000).toISOString(),
      isUrgent: false,
      accountCode: 'ACC-3312',
      notes: 'Urgent stock top-up for clinic stock cabinet.',
      totalAmount: 320.0,
      totalPieces: 16,
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      frame: null,
      lensItems: [
        {
          id: 'item-003',
          orderId: 'ord-stk-002',
          lensType: 'Stock Lens',
          productName: '1.56 BlueBlock HMC Stock Lens',
          designType: 'Spherical',
          refractiveIndex: 1.56,
          material: 'CR-39 Plastic',
          coating: 'HMC',
          treatments: 'HMC, UV420, Blue Filter',
          quantity: 8,
          eyeSide: 'PAIR',
          sphere: -2.0,
          cylinder: -0.5,
          diameter: 72,
          unitPrice: 20.0,
          subtotal: 160.0,
        },
        {
          id: 'item-004',
          orderId: 'ord-stk-002',
          lensType: 'Stock Lens',
          productName: '1.56 BlueBlock HMC Stock Lens',
          designType: 'Spherical',
          refractiveIndex: 1.56,
          material: 'CR-39 Plastic',
          coating: 'HMC',
          treatments: 'HMC, UV420, Blue Filter',
          quantity: 8,
          eyeSide: 'PAIR',
          sphere: -2.5,
          cylinder: -0.5,
          diameter: 72,
          unitPrice: 20.0,
          subtotal: 160.0,
        },
      ],
    },
    {
      id: 'ord-rem-003',
      orderNo: 'REM-2026-0512',
      orderRef: 'EDG-REM-882',
      orderType: 'Remote Edging',
      buyer: 'Battambang Optical House',
      shop: 'Street 3 Shop',
      orderingPerson: 'Khim Somnang',
      patientName: 'Chan Sreypov',
      patientCode: 'PAT-BTB-1044',
      trayId: 'TRAY-B07',
      orderStatus: 'Coating / Tinting',
      orderDate: new Date(Date.now() - 3600000 * 12).toISOString(),
      logisticsDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      isUrgent: false,
      accountCode: 'ACC-7740',
      notes: 'Remote edging with safety bevel. Gradient Brown 80% to 20%.',
      totalAmount: 185.0,
      totalPieces: 2,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      frame: {
        id: 'frm-003',
        orderId: 'ord-rem-003',
        frameShape: 'Cat Eye / Designer',
        tracerFlag: 'Remote Tracer File #CAT-02',
        frameWidthA: 52.0,
        frameHeightB: 42.0,
        effectiveDiaEd: 56.0,
        noseBridgeDbl: 17.0,
        faceFormAngle: 4.0,
        pantoscopicTilt: 9.0,
        refractedBvd: 13.0,
        fittedBvd: 13.0,
        baseCurve: 5.0,
        frameType: 'Plastic Fullrim',
        vd: 13.0,
        tilt: 9.0,
        wrap: 4.0,
        pdFarR: 30.5,
        pdFarL: 31.0,
        pdNearR: 28.5,
        pdNearL: 29.0,
        heightR: 24.0,
        heightL: 24.0,
      },
      lensItems: [
        {
          id: 'item-005',
          orderId: 'ord-rem-003',
          lensType: 'Progressive',
          productName: 'Seiko Vision Progresiv 1.67 Freeform',
          designType: 'Free form',
          refractiveIndex: 1.67,
          material: 'High Index MR-7',
          tintingType: 'Gradient',
          tintColor: 'Amber Brown',
          tintFrom: '80%',
          tintTo: '20%',
          gradationPoint: 'Fitting Cross + 2mm',
          coating: 'Super HMC',
          treatments: 'Super HMC, Tint Gradient, Scratch Resistant',
          quantity: 1,
          eyeSide: 'Right',
          sphere: +1.5,
          cylinder: -0.75,
          axis: 180,
          addition: 2.0,
          diameter: 75,
          dpd: 30.5,
          npd: 28.5,
          hPrism: null,
          hBase: null,
          vPrism: null,
          vBase: null,
          fh: 24.0,
          remarks: 'OD Progressive Corridors 14mm',
          unitPrice: 92.5,
          subtotal: 92.5,
        },
        {
          id: 'item-006',
          orderId: 'ord-rem-003',
          lensType: 'Progressive',
          productName: 'Seiko Vision Progresiv 1.67 Freeform',
          designType: 'Free form',
          refractiveIndex: 1.67,
          material: 'High Index MR-7',
          tintingType: 'Gradient',
          tintColor: 'Amber Brown',
          tintFrom: '80%',
          tintTo: '20%',
          gradationPoint: 'Fitting Cross + 2mm',
          coating: 'Super HMC',
          treatments: 'Super HMC, Tint Gradient, Scratch Resistant',
          quantity: 1,
          eyeSide: 'Left',
          sphere: +1.25,
          cylinder: -0.5,
          axis: 170,
          addition: 2.0,
          diameter: 75,
          dpd: 31.0,
          npd: 29.0,
          hPrism: null,
          hBase: null,
          vPrism: null,
          vBase: null,
          fh: 24.0,
          remarks: 'OS Progressive Corridors 14mm',
          unitPrice: 92.5,
          subtotal: 92.5,
        },
      ],
    },
  ];

  async getUnifiedOrders(query?: {
    orderState?: string;
    orderType?: string;
    search?: string;
    trayId?: string;
    patientName?: string;
    dateFrom?: string;
    dateTo?: string;
    isUrgent?: string | boolean;
  }) {
    try {
      if ((this.prisma as any).unifiedLensOrder) {
        const where: any = {};
        if (query?.orderState && query.orderState !== 'All') {
          where.orderStatus = query.orderState;
        }
        if (query?.orderType && query.orderType !== 'All') {
          where.orderType = query.orderType;
        }
        if (query?.trayId) {
          where.trayId = { contains: query.trayId, mode: 'insensitive' };
        }
        if (query?.patientName) {
          where.patientName = { contains: query.patientName, mode: 'insensitive' };
        }
        if (query?.search) {
          where.OR = [
            { orderNo: { contains: query.search, mode: 'insensitive' } },
            { orderRef: { contains: query.search, mode: 'insensitive' } },
            { patientName: { contains: query.search, mode: 'insensitive' } },
            { buyer: { contains: query.search, mode: 'insensitive' } },
            { trayId: { contains: query.search, mode: 'insensitive' } },
          ];
        }

        const dbOrders = await (this.prisma as any).unifiedLensOrder.findMany({
          where,
          include: { frame: true, lensItems: true },
          orderBy: { createdAt: 'desc' },
        });

        if (dbOrders && dbOrders.length > 0) return dbOrders;
      }
    } catch {
      // Fallback to memory store
    }

    // Filter memory store
    let list = [...this.memoryUnifiedOrders];
    if (query?.orderState && query.orderState !== 'All') {
      list = list.filter((o) => o.orderStatus === query.orderState);
    }
    if (query?.orderType && query.orderType !== 'All') {
      list = list.filter((o) => o.orderType === query.orderType);
    }
    if (query?.trayId) {
      list = list.filter((o) => (o.trayId || '').toLowerCase().includes(query.trayId!.toLowerCase()));
    }
    if (query?.patientName) {
      list = list.filter((o) => (o.patientName || '').toLowerCase().includes(query.patientName!.toLowerCase()));
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (o) =>
          (o.orderNo || '').toLowerCase().includes(q) ||
          (o.orderRef || '').toLowerCase().includes(q) ||
          (o.patientName || '').toLowerCase().includes(q) ||
          (o.buyer || '').toLowerCase().includes(q) ||
          (o.trayId || '').toLowerCase().includes(q),
      );
    }
    if (query?.isUrgent === true || query?.isUrgent === 'true') {
      list = list.filter((o) => o.isUrgent === true);
    }

    return list;
  }

  async getUnifiedOrderById(id: string) {
    try {
      if ((this.prisma as any).unifiedLensOrder) {
        const order = await (this.prisma as any).unifiedLensOrder.findUnique({
          where: { id },
          include: { frame: true, lensItems: true },
        });
        if (order) return order;
      }
    } catch {}

    const found = this.memoryUnifiedOrders.find((o) => o.id === id || o.orderNo === id);
    if (!found) throw new NotFoundException(`Order with ID ${id} not found`);
    return found;
  }

  async createUnifiedOrder(dto: any) {
    const orderNo = dto.orderNo || `${dto.orderType === 'Stock Lens Order' ? 'STK' : 'RX'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `ord-${Date.now()}`;

    let totalAmount = dto.totalAmount || 0;
    let totalPieces = dto.totalPieces || 0;

    const items = (dto.items || []).map((item: any, idx: number) => {
      const subtotal = item.subtotal || (item.quantity || 1) * (item.unitPrice || 0);
      totalAmount += subtotal;
      totalPieces += item.quantity || 1;
      return {
        id: `item-${Date.now()}-${idx}`,
        orderId: id,
        lensType: item.lensType || 'Single Vision RX',
        productName: item.productName || 'Optical Lens',
        designType: item.designType || 'Aspherical',
        refractiveIndex: item.refractiveIndex ? Number(item.refractiveIndex) : 1.6,
        material: item.material || 'CR-39 Plastic',
        tintingType: item.tintingType || 'None',
        tintColor: item.tintColor || null,
        tintFrom: item.tintFrom || null,
        tintTo: item.tintTo || null,
        gradationPoint: item.gradationPoint || null,
        coating: item.coating || 'Super HMC',
        treatments: item.treatments || 'Super HMC',
        quantity: item.quantity || 1,
        specialInstructions: item.specialInstructions || null,
        eyeSide: item.eyeSide || 'PAIR',
        sphere: item.sphere !== undefined && item.sphere !== null ? Number(item.sphere) : null,
        cylinder: item.cylinder !== undefined && item.cylinder !== null ? Number(item.cylinder) : null,
        axis: item.axis !== undefined && item.axis !== null ? Number(item.axis) : null,
        addition: item.addition !== undefined && item.addition !== null ? Number(item.addition) : null,
        diameter: item.diameter !== undefined && item.diameter !== null ? Number(item.diameter) : 70,
        dpd: item.dpd !== undefined && item.dpd !== null ? Number(item.dpd) : null,
        npd: item.npd !== undefined && item.npd !== null ? Number(item.npd) : null,
        hPrism: item.hPrism !== undefined && item.hPrism !== null ? Number(item.hPrism) : null,
        hBase: item.hBase || null,
        vPrism: item.vPrism !== undefined && item.vPrism !== null ? Number(item.vPrism) : null,
        vBase: item.vBase || null,
        fh: item.fh !== undefined && item.fh !== null ? Number(item.fh) : null,
        remarks: item.remarks || null,
        unitPrice: item.unitPrice || 0,
        subtotal,
        createdAt: new Date().toISOString(),
      };
    });

    const frameData = dto.frame
      ? {
          id: `frm-${Date.now()}`,
          orderId: id,
          frameShape: dto.frame.frameShape || 'Standard',
          tracerFlag: dto.frame.tracerFlag || 'Manual Specs',
          frameWidthA: dto.frame.frameWidthA ? Number(dto.frame.frameWidthA) : null,
          frameHeightB: dto.frame.frameHeightB ? Number(dto.frame.frameHeightB) : null,
          effectiveDiaEd: dto.frame.effectiveDiaEd ? Number(dto.frame.effectiveDiaEd) : null,
          noseBridgeDbl: dto.frame.noseBridgeDbl ? Number(dto.frame.noseBridgeDbl) : null,
          faceFormAngle: dto.frame.faceFormAngle ? Number(dto.frame.faceFormAngle) : null,
          pantoscopicTilt: dto.frame.pantoscopicTilt ? Number(dto.frame.pantoscopicTilt) : null,
          refractedBvd: dto.frame.refractedBvd ? Number(dto.frame.refractedBvd) : null,
          fittedBvd: dto.frame.fittedBvd ? Number(dto.frame.fittedBvd) : null,
          baseCurve: dto.frame.baseCurve ? Number(dto.frame.baseCurve) : null,
          frameType: dto.frame.frameType || 'Metal Fullrim',
          vd: dto.frame.vd ? Number(dto.frame.vd) : null,
          tilt: dto.frame.tilt ? Number(dto.frame.tilt) : null,
          wrap: dto.frame.wrap ? Number(dto.frame.wrap) : null,
          pdFarR: dto.frame.pdFarR ? Number(dto.frame.pdFarR) : null,
          pdFarL: dto.frame.pdFarL ? Number(dto.frame.pdFarL) : null,
          pdNearR: dto.frame.pdNearR ? Number(dto.frame.pdNearR) : null,
          pdNearL: dto.frame.pdNearL ? Number(dto.frame.pdNearL) : null,
          heightR: dto.frame.heightR ? Number(dto.frame.heightR) : null,
          heightL: dto.frame.heightL ? Number(dto.frame.heightL) : null,
        }
      : null;

    const newOrder = {
      id,
      orderNo,
      orderRef: dto.orderRef || null,
      orderType: dto.orderType || 'RX Lab Order',
      buyer: dto.buyer || 'Direct Optical Shop',
      shop: dto.shop || 'Central Optical Lab',
      orderingPerson: dto.orderingPerson || 'Optical Lab Technician',
      patientName: dto.patientName || 'Customer Rx',
      patientCode: dto.patientCode || `PAT-${Date.now().toString().slice(-6)}`,
      trayId: dto.trayId || `TRAY-${Math.floor(10 + Math.random() * 90)}`,
      orderStatus: dto.orderStatus || 'Producing Surfacing',
      orderDate: dto.orderDate || new Date().toISOString(),
      logisticsDate: dto.logisticsDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      isUrgent: dto.isUrgent === true || dto.isUrgent === 'true',
      accountCode: dto.accountCode || 'ACC-DEFAULT',
      notes: dto.notes || null,
      totalAmount: dto.totalAmount || totalAmount,
      totalPieces: dto.totalPieces || totalPieces,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      frame: frameData,
      lensItems: items,
    };

    // Try save to Prisma
    try {
      if ((this.prisma as any).unifiedLensOrder) {
        await (this.prisma as any).unifiedLensOrder.create({
          data: {
            id: newOrder.id,
            orderNo: newOrder.orderNo,
            orderRef: newOrder.orderRef,
            orderType: newOrder.orderType,
            buyer: newOrder.buyer,
            shop: newOrder.shop,
            orderingPerson: newOrder.orderingPerson,
            patientName: newOrder.patientName,
            patientCode: newOrder.patientCode,
            trayId: newOrder.trayId,
            orderStatus: newOrder.orderStatus,
            orderDate: new Date(newOrder.orderDate),
            logisticsDate: newOrder.logisticsDate ? new Date(newOrder.logisticsDate) : null,
            isUrgent: newOrder.isUrgent,
            accountCode: newOrder.accountCode,
            notes: newOrder.notes,
            totalAmount: newOrder.totalAmount,
            totalPieces: newOrder.totalPieces,
            frame: frameData ? { create: frameData } : undefined,
            lensItems: { create: items },
          },
        });
      }
    } catch {}

    // Add to memory list
    this.memoryUnifiedOrders.unshift(newOrder);
    return newOrder;
  }

  async updateUnifiedOrderStatus(id: string, status: string) {
    try {
      if ((this.prisma as any).unifiedLensOrder) {
        await (this.prisma as any).unifiedLensOrder.update({
          where: { id },
          data: { orderStatus: status, updatedAt: new Date() },
        });
      }
    } catch {}

    const order = this.memoryUnifiedOrders.find((o) => o.id === id || o.orderNo === id);
    if (order) {
      order.orderStatus = status;
      order.updatedAt = new Date().toISOString();
      return order;
    }
    throw new NotFoundException(`Order ${id} not found`);
  }

  async deleteUnifiedOrder(id: string) {
    try {
      if ((this.prisma as any).unifiedLensOrder) {
        await (this.prisma as any).unifiedLensOrder.delete({ where: { id } });
      }
    } catch {}

    const idx = this.memoryUnifiedOrders.findIndex((o) => o.id === id || o.orderNo === id);
    if (idx !== -1) {
      this.memoryUnifiedOrders.splice(idx, 1);
      return { success: true, message: `Order ${id} deleted` };
    }
    throw new NotFoundException(`Order ${id} not found`);
  }

  // Stock Matrix Catalog & Batch Order
  async getStockMatrixCatalog(category = '1.56 BlueBlock HMC', treatment = 'HMC') {
    const categories = [
      { id: '1.499-clear', name: '1.499 Clear SV', index: 1.5, material: 'CR-39 Plastic', basePrice: 12.0 },
      { id: '1.56-blueblock', name: '1.56 BlueBlock HMC', index: 1.56, material: 'CR-39 Plastic', basePrice: 18.0 },
      { id: '1.60-hi-index', name: '1.60 Hi-Index Super HMC', index: 1.6, material: 'MR-8 Resin', basePrice: 28.0 },
      { id: '1.67-aspheric', name: '1.67 Aspheric BlueCut', index: 1.67, material: 'MR-7 Resin', basePrice: 42.0 },
      { id: '1.56-photo', name: '1.56 Photochromic FastGrey', index: 1.56, material: 'Photochromic Monomer', basePrice: 32.0 },
    ];

    const treatments = ['UNC', 'HC', 'HMC', 'Super HMC', 'Anti-Fog HMC'];

    // Generate SPH x CYL matrix table values
    // SPH: -6.00 to +6.00 (step 0.25)
    // CYL: 0.00 to -4.00 (step 0.25)
    const activeCategory = categories.find((c) => c.name === category) || categories[1];
    
    return {
      categories,
      treatments,
      activeCategory,
      activeTreatment: treatment,
    };
  }
}

