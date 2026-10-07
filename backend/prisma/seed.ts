import { PrismaClient, Role, ProductType, ProductStatus, OrderStatus, DeliveryMethod, DeliveryStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting BrightEyes Prisma Database Seeding...');

  // Clean existing tables
  await prisma.delivery.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.retailerInventory.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.store.deleteMany();
  await prisma.retailer.deleteMany();
  await prisma.wholesaler.deleteMany();
  await prisma.user.deleteMany();

  const commonPassword = await bcrypt.hash('password123', 10);

  // 1. Create Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@brighteyes.com',
      password: commonPassword,
      name: 'BrightEyes Platform Admin',
      phone: '+85512000111',
      role: Role.SUPER_ADMIN,
    },
  });

  // 2. Create 2 Wholesalers
  const w1User = await prisma.user.create({
    data: {
      email: 'wholesaler1@brighteyes.com',
      password: commonPassword,
      name: 'Sokha Optical Wholesale Manager',
      phone: '+85512345001',
      role: Role.WHOLESALER,
    },
  });

  const w1 = await prisma.wholesaler.create({
    data: {
      userId: w1User.id,
      companyName: 'Sokha Optical Supply Co., Ltd',
      businessAddress: 'No. 142, Monivong Blvd, Sangkat Boeung Keng Kang 1',
      province: 'Phnom Penh',
      district: 'Khan Chamkar Mon',
      phone: '+85512345001',
      email: 'sales@sokhaoptical.com',
      description: 'Leading Cambodian distributor of premium eyewear frames, luxury sunglasses, and ophthalmic equipment.',
      logoUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=300&q=80',
    },
  });

  const w2User = await prisma.user.create({
    data: {
      email: 'wholesaler2@brighteyes.com',
      password: commonPassword,
      name: 'Angkor Lens Distributors Manager',
      phone: '+85512345002',
      role: Role.WHOLESALER,
    },
  });

  const w2 = await prisma.wholesaler.create({
    data: {
      userId: w2User.id,
      companyName: 'Angkor Vision & Lens Wholesale',
      businessAddress: 'Plot 88, Russian Hospital Blvd, Sangkat Phsar Depo 3',
      province: 'Phnom Penh',
      district: 'Khan Toul Kork',
      phone: '+85512345002',
      email: 'contact@angkorlens.com.kh',
      description: 'Authorized importer of high-index optical lenses, soft contact lenses, and precision optometric machinery.',
      logoUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=300&q=80',
    },
  });

  // 3. Create 5 Retailers with Stores & Carts
  const retailers = [];
  const retailerConfigs = [
    { email: 'retailer1@brighteyes.com', name: 'Phnom Penh Eyewear Center', store: 'Phnom Penh Eyewear Center', address: 'St 271, Sen Sok', province: 'Phnom Penh', district: 'Khan Sen Sok' },
    { email: 'retailer2@brighteyes.com', name: 'Siem Reap Vision Care', store: 'Siem Reap Vision Care Clinic', address: 'Sivutha Blvd, Siem Reap', province: 'Siem Reap', district: 'Krong Siem Reap' },
    { email: 'retailer3@brighteyes.com', name: 'Battambang Optical House', store: 'Battambang Optical House', address: 'Street 3, Battambang', province: 'Battambang', district: 'Krong Battambang' },
    { email: 'retailer4@brighteyes.com', name: 'Sihanoukville Bright Vision', store: 'Sihanoukville Bright Vision Shop', address: 'Ekareach Street, Sihanoukville', province: 'Preah Sihanouk', district: 'Krong Preah Sihanouk' },
    { email: 'retailer5@brighteyes.com', name: 'Kampot Optics & Style', store: 'Kampot Optics & Style Store', address: 'Riverside Road, Kampot', province: 'Kampot', district: 'Krong Kampot' },
  ];

  for (const cfg of retailerConfigs) {
    const rUser = await prisma.user.create({
      data: {
        email: cfg.email,
        password: commonPassword,
        name: cfg.name,
        phone: '+85512999888',
        role: Role.RETAILER,
      },
    });

    const ret = await prisma.retailer.create({
      data: {
        userId: rUser.id,
        storeName: cfg.store,
        storeAddress: cfg.address,
        province: cfg.province,
        district: cfg.district,
        phone: '+85512999888',
        email: cfg.email,
      },
    });

    await prisma.store.create({
      data: {
        retailerId: ret.id,
        storeName: cfg.store,
        address: cfg.address,
        province: cfg.province,
        district: cfg.district,
        phone: '+85512999888',
      },
    });

    await prisma.cart.create({
      data: { retailerId: ret.id },
    });

    retailers.push(ret);
  }

  // 4. Create 10 Categories
  const categoryData = [
    { name: 'Eyeglass Frames', description: 'Optical frames for prescription lenses (Acetate, Titanium, Metal)', icon: 'Glasses' },
    { name: 'Sunglasses', description: 'UV400 protection and polarized fashion sunglasses', icon: 'Sun' },
    { name: 'Contact Lenses', description: 'Daily, monthly, and color cosmetic contact lenses', icon: 'Eye' },
    { name: 'Single Vision Lenses', description: 'Standard prescription optical lenses for myopia & hyperopia', icon: 'Disc' },
    { name: 'Progressive Lenses', description: 'Multi-focal progressive lenses for presbyopia', icon: 'Layers' },
    { name: 'Blue Light Blocking Lenses', description: 'Computer & screen anti-blue light coating lenses', icon: 'Shield' },
    { name: 'Optical Accessories', description: 'Eyeglass cases, cleaning cloths, chains, and nose pads', icon: 'Package' },
    { name: 'Optometric Equipment', description: 'Auto refractometers, phoropters, and lensmeters', icon: 'Cpu' },
    { name: 'Workshop Tools', description: 'Edging tools, pliers, frame warmers, and screws', icon: 'Wrench' },
    { name: 'Lens Care Solutions', description: 'Multi-purpose contact lens cleaning and saline solutions', icon: 'Droplets' },
  ];

  const categories: { [name: string]: any } = {};
  for (const c of categoryData) {
    const createdCat = await prisma.productCategory.create({ data: c });
    categories[c.name] = createdCat;
  }

  // 5. Create 32 Optical Products with Realistic Cambodian Optical Specs
  const rawProducts = [
    // Frames
    { SKU: 'FRM-RB-2140', name: 'Ray-Ban Wayfarer Classic Frame', cat: 'Eyeglass Frames', brand: 'Ray-Ban', type: ProductType.FRAME, price: 150, wPrice: 85, stock: 120, wholesaler: w1, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'FRM-RB-5154', name: 'Ray-Ban Clubmaster Optical', cat: 'Eyeglass Frames', brand: 'Ray-Ban', type: ProductType.FRAME, price: 160, wPrice: 92, stock: 80, wholesaler: w1, img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'FRM-OK-8056', name: 'Oakley Pitchman R Titanium Frame', cat: 'Eyeglass Frames', brand: 'Oakley', type: ProductType.FRAME, price: 180, wPrice: 110, stock: 45, wholesaler: w1, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'FRM-GC-0021', name: 'Gucci Full Titanium Oval Frame', cat: 'Eyeglass Frames', brand: 'Gucci', type: ProductType.FRAME, price: 320, wPrice: 195, stock: 30, wholesaler: w1, img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'FRM-PR-01XV', name: 'Prada Cinema Cat-Eye Frame', cat: 'Eyeglass Frames', brand: 'Prada', type: ProductType.FRAME, price: 290, wPrice: 175, stock: 25, wholesaler: w1, img: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'FRM-SK-4002', name: 'Seiko Ultra-Light Memory Metal', cat: 'Eyeglass Frames', brand: 'Seiko', type: ProductType.FRAME, price: 140, wPrice: 78, stock: 90, wholesaler: w1, img: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=600&q=80' },

    // Sunglasses
    { SKU: 'SUN-RB-3025', name: 'Ray-Ban Aviator Classic Gold', cat: 'Sunglasses', brand: 'Ray-Ban', type: ProductType.SUNGLASSES, price: 170, wPrice: 98, stock: 150, wholesaler: w1, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'SUN-OK-9013', name: 'Oakley Holbrook Polarized Prizm', cat: 'Sunglasses', brand: 'Oakley', type: ProductType.SUNGLASSES, price: 195, wPrice: 118, stock: 65, wholesaler: w1, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'SUN-TF-0237', name: 'Tom Ford Snowdon Polarized', cat: 'Sunglasses', brand: 'Tom Ford', type: ProductType.SUNGLASSES, price: 350, wPrice: 215, stock: 15, wholesaler: w1, img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'SUN-CH-5412', name: 'Chanel Square Pearl Edition', cat: 'Sunglasses', brand: 'Chanel', type: ProductType.SUNGLASSES, price: 420, wPrice: 260, stock: 10, wholesaler: w1, img: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80' },

    // Contact Lenses
    { SKU: 'CTL-AC-1D90', name: 'Acuvue Moist 1-Day (90 Pack)', cat: 'Contact Lenses', brand: 'Johnson & Johnson', type: ProductType.CONTACT_LENS, price: 75, wPrice: 46, stock: 200, wholesaler: w2, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'CTL-AC-OAS2', name: 'Acuvue Oasys Hydraclear 2-Week', cat: 'Contact Lenses', brand: 'Johnson & Johnson', type: ProductType.CONTACT_LENS, price: 40, wPrice: 24, stock: 300, wholesaler: w2, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'CTL-AL-DAIL', name: 'Alcon Dailies Total1 Water Gradient', cat: 'Contact Lenses', brand: 'Alcon', type: ProductType.CONTACT_LENS, price: 85, wPrice: 52, stock: 180, wholesaler: w2, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'CTL-FL-COLR', name: 'FreshLook ColorBlends Monthly (2 Pack)', cat: 'Contact Lenses', brand: 'Alcon', type: ProductType.CONTACT_LENS, price: 32, wPrice: 18, stock: 250, wholesaler: w2, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },

    // Single Vision Lenses
    { SKU: 'LNS-ES-156S', name: 'Essilor Crizal Sapphire HR 1.56 AR', cat: 'Single Vision Lenses', brand: 'Essilor', type: ProductType.OPTICAL_LENS, price: 60, wPrice: 34, stock: 500, wholesaler: w2, img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'LNS-ES-167U', name: 'Essilor Stylis 1.67 Ultra-Thin', cat: 'Single Vision Lenses', brand: 'Essilor', type: ProductType.OPTICAL_LENS, price: 110, wPrice: 65, stock: 220, wholesaler: w2, img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'LNS-HY-160N', name: 'Hoya Nulux 1.60 HVLL Anti-Scratch', cat: 'Single Vision Lenses', brand: 'Hoya', type: ProductType.OPTICAL_LENS, price: 85, wPrice: 48, stock: 310, wholesaler: w2, img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'LNS-CZ-174P', name: 'Zeiss Single Vision 1.74 Superb', cat: 'Single Vision Lenses', brand: 'Carl Zeiss', type: ProductType.OPTICAL_LENS, price: 210, wPrice: 130, stock: 60, wholesaler: w2, img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80' },

    // Progressive Lenses
    { SKU: 'LNS-ES-VARX', name: 'Essilor Varilux Comfort Max 1.60', cat: 'Progressive Lenses', brand: 'Essilor', type: ProductType.OPTICAL_LENS, price: 250, wPrice: 155, stock: 40, wholesaler: w2, img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'LNS-HY-BALN', name: 'Hoya Balansis Progressive 1.56', cat: 'Progressive Lenses', brand: 'Hoya', type: ProductType.OPTICAL_LENS, price: 220, wPrice: 135, stock: 55, wholesaler: w2, img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80' },

    // Blue Light Blocking Lenses
    { SKU: 'LNS-ES-PREV', name: 'Essilor Crizal Prevencia Anti-Blue 1.56', cat: 'Blue Light Blocking Lenses', brand: 'Essilor', type: ProductType.OPTICAL_LENS, price: 75, wPrice: 42, stock: 400, wholesaler: w2, img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'LNS-HY-BLUE', name: 'Hoya BlueControl 1.60 AS', cat: 'Blue Light Blocking Lenses', brand: 'Hoya', type: ProductType.OPTICAL_LENS, price: 90, wPrice: 52, stock: 350, wholesaler: w2, img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80' },

    // Accessories
    { SKU: 'ACC-HR-CLTH', name: 'Microfiber Optical Cleaning Cloth (50 Pack)', cat: 'Optical Accessories', brand: 'BrightCare', type: ProductType.ACCESSORY, price: 25, wPrice: 12, stock: 600, wholesaler: w1, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'ACC-LT-CASE', name: 'Hard Shell Leatherette Glasses Case (10 Pack)', cat: 'Optical Accessories', brand: 'BrightCare', type: ProductType.ACCESSORY, price: 35, wPrice: 18, stock: 450, wholesaler: w1, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'ACC-SP-SPRY', name: 'Anti-Fog Lens Cleaner Spray 60ml (24 Pack)', cat: 'Optical Accessories', brand: 'Zeiss', type: ProductType.ACCESSORY, price: 96, wPrice: 54, stock: 120, wholesaler: w1, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },

    // Optometric Equipment
    { SKU: 'EQP-ND-ARK1', name: 'Nidek ARK-1 Auto Ref/Keratometer', cat: 'Optometric Equipment', brand: 'Nidek', type: ProductType.EQUIPMENT, price: 8500, wPrice: 6200, stock: 4, wholesaler: w2, img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'EQP-TOP-CV50', name: 'Topcon CV-5000 Digital Phoropter', cat: 'Optometric Equipment', brand: 'Topcon', type: ProductType.EQUIPMENT, price: 6400, wPrice: 4800, stock: 6, wholesaler: w2, img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'EQP-CZ-LNM2', name: 'Zeiss VISULENS 550 Digital Lensmeter', cat: 'Optometric Equipment', brand: 'Carl Zeiss', type: ProductType.EQUIPMENT, price: 3800, wPrice: 2900, stock: 8, wholesaler: w2, img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80' },

    // Tools & Solutions
    { SKU: 'SOL-RN-BIOT', name: 'Bausch & Lomb Biotrue Solution 300ml (12 Pack)', cat: 'Lens Care Solutions', brand: 'Bausch & Lomb', type: ProductType.ACCESSORY, price: 108, wPrice: 66, stock: 150, wholesaler: w2, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'SOL-OP-FREE', name: 'Alcon OPTI-FREE Puremoist 300ml (12 Pack)', cat: 'Lens Care Solutions', brand: 'Alcon', type: ProductType.ACCESSORY, price: 114, wPrice: 70, stock: 140, wholesaler: w2, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'TOL-KIT-PRO1', name: 'Master Optical Pliers & Screw Tool Kit', cat: 'Workshop Tools', brand: 'ProTool', type: ProductType.OTHER, price: 180, wPrice: 110, stock: 25, wholesaler: w1, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
    { SKU: 'TOL-FRM-WARM', name: 'Digital Temperature Frame Warmer Machine', cat: 'Workshop Tools', brand: 'ProTool', type: ProductType.OTHER, price: 120, wPrice: 72, stock: 18, wholesaler: w1, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
  ];

  const createdProducts = [];
  for (const p of rawProducts) {
    const category = categories[p.cat];

    const prod = await prisma.product.create({
      data: {
        SKU: p.SKU,
        name: p.name,
        description: `High quality ${p.name} supplied by ${p.wholesaler.companyName}. Guaranteed authentic optical grade product for professional optical retailers.`,
        categoryId: category.id,
        wholesalerId: p.wholesaler.id,
        brand: p.brand,
        productType: p.type,
        model: p.SKU.split('-')[1] || 'Standard',
        color: p.type === ProductType.FRAME || p.type === ProductType.SUNGLASSES ? 'Black / Tortoise' : 'Clear',
        size: p.type === ProductType.FRAME ? '52-18-140' : 'Universal',
        material: p.type === ProductType.FRAME ? 'Acetate & Titanium' : 'Polycarbonate',
        gender: 'UNISEX',
        price: p.price,
        wholesalePrice: p.wPrice,
        status: p.stock > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: prod.id,
        imageUrl: p.img,
        isPrimary: true,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: prod.id,
        wholesalerId: p.wholesaler.id,
        quantity: p.stock,
        reservedQuantity: 0,
        lowStockThreshold: 10,
      },
    });

    createdProducts.push(prod);
  }

  // 6. Create Realistic Sample Orders
  const sampleOrder1 = await prisma.order.create({
    data: {
      orderNumber: 'BE-20261001-8891',
      retailerId: retailers[0].id,
      wholesalerId: w1.id,
      subtotal: 442.0,
      deliveryFee: 5.0,
      total: 447.0,
      orderStatus: OrderStatus.PROCESSING,
      shippingAddress: 'St 271, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
      province: 'Phnom Penh',
      district: 'Khan Sen Sok',
      phone: '+85512999888',
      notes: 'Express delivery required for retail store opening.',
      orderItems: {
        create: [
          { productId: createdProducts[0].id, SKU: createdProducts[0].SKU, productName: createdProducts[0].name, quantity: 4, price: 85.0, subtotal: 340.0 },
          { productId: createdProducts[6].id, SKU: createdProducts[6].SKU, productName: createdProducts[6].name, quantity: 1, price: 98.0, subtotal: 98.0 },
        ],
      },
    },
  });

  await prisma.delivery.create({
    data: {
      orderId: sampleOrder1.id,
      deliveryMethod: DeliveryMethod.DELIVERY,
      deliveryAddress: 'St 271, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
      province: 'Phnom Penh',
      district: 'Khan Sen Sok',
      phone: '+85512999888',
      trackingNumber: 'TRK-KH-90812',
      status: DeliveryStatus.ASSIGNED,
    },
  });

  const sampleOrder2 = await prisma.order.create({
    data: {
      orderNumber: 'BE-20261001-5120',
      retailerId: retailers[1].id,
      wholesalerId: w2.id,
      subtotal: 310.0,
      deliveryFee: 5.0,
      total: 315.0,
      orderStatus: OrderStatus.DELIVERED,
      shippingAddress: 'Sivutha Blvd, Krong Siem Reap',
      province: 'Siem Reap',
      district: 'Krong Siem Reap',
      phone: '+85512999888',
      notes: 'Delivered successfully via Vet Air Bus Express.',
      orderItems: {
        create: [
          { productId: createdProducts[10].id, SKU: createdProducts[10].SKU, productName: createdProducts[10].name, quantity: 5, price: 46.0, subtotal: 230.0 },
          { productId: createdProducts[14].id, SKU: createdProducts[14].SKU, productName: createdProducts[14].name, quantity: 2, price: 40.0, subtotal: 80.0 },
        ],
      },
    },
  });

  await prisma.delivery.create({
    data: {
      orderId: sampleOrder2.id,
      deliveryMethod: DeliveryMethod.DELIVERY,
      deliveryAddress: 'Sivutha Blvd, Krong Siem Reap',
      province: 'Siem Reap',
      district: 'Krong Siem Reap',
      phone: '+85512999888',
      trackingNumber: 'TRK-KH-11234',
      status: DeliveryStatus.DELIVERED,
    },
  });

  // Populate Retailer Inventory for Delivered Order
  await prisma.retailerInventory.create({
    data: {
      retailerId: retailers[1].id,
      productId: createdProducts[10].id,
      quantity: 5,
    },
  });

  await prisma.retailerInventory.create({
    data: {
      retailerId: retailers[1].id,
      productId: createdProducts[14].id,
      quantity: 2,
    },
  });

  console.log('✅ BrightEyes Seed Data Successfully Created!');
  console.log('========================================================');
  console.log('👑 Super Admin:   admin@brighteyes.com / password123');
  console.log('🏬 Wholesaler 1:  wholesaler1@brighteyes.com / password123');
  console.log('🏬 Wholesaler 2:  wholesaler2@brighteyes.com / password123');
  console.log('👓 Retailer 1-5:  retailer1@brighteyes.com / password123');
  console.log('========================================================');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
