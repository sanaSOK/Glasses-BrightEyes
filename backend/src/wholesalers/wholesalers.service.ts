import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WholesalersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.wholesaler.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: { products: true, orders: true },
        },
      },
      orderBy: { companyName: 'asc' },
    });
  }

  async findOne(id: string) {
    const wholesaler = await this.prisma.wholesaler.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        _count: {
          select: { products: true, orders: true },
        },
      },
    });

    if (!wholesaler) {
      throw new NotFoundException(`Wholesaler with ID ${id} not found`);
    }

    return wholesaler;
  }

  async getWholesalerProducts(id: string) {
    await this.findOne(id);

    return this.prisma.product.findMany({
      where: { wholesalerId: id, status: 'ACTIVE' },
      include: {
        category: true,
        images: true,
        inventory: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProfile(userId: string, data: any) {
    const wholesaler = await this.prisma.wholesaler.findUnique({
      where: { userId },
    });

    if (!wholesaler) {
      throw new NotFoundException('Wholesaler profile not found');
    }

    return this.prisma.wholesaler.update({
      where: { id: wholesaler.id },
      data,
    });
  }

  async getMapLocations() {
    const CAMBODIA_COORDS: Record<string, { lat: number; lng: number }> = {
      'Phnom Penh': { lat: 11.5564, lng: 104.9282 },
      'Siem Reap': { lat: 13.3671, lng: 103.8448 },
      'Battambang': { lat: 13.0957, lng: 103.2022 },
      'Preah Sihanouk': { lat: 10.6253, lng: 103.5234 },
      'Sihanoukville': { lat: 10.6253, lng: 103.5234 },
      'Kampong Cham': { lat: 11.9924, lng: 105.4645 },
      'Kampot': { lat: 10.6104, lng: 104.1818 },
      'Kandal': { lat: 11.4588, lng: 104.9469 },
      'Banteay Meanchey': { lat: 13.5859, lng: 102.9737 },
      'Poipet': { lat: 13.6561, lng: 102.5634 },
      'Kampong Chhnang': { lat: 12.2500, lng: 104.6667 },
      'Kampong Speu': { lat: 11.4533, lng: 104.5209 },
      'Kampong Thom': { lat: 12.7111, lng: 104.8887 },
      'Kep': { lat: 10.4828, lng: 104.3167 },
      'Koh Kong': { lat: 11.6153, lng: 102.9838 },
      'Kratié': { lat: 12.4881, lng: 106.0188 },
      'Mondulkiri': { lat: 12.4558, lng: 107.1881 },
      'Oddar Meanchey': { lat: 14.1817, lng: 103.5176 },
      'Pailin': { lat: 12.8489, lng: 102.6093 },
      'Preah Vihear': { lat: 13.8073, lng: 104.9805 },
      'Prey Veng': { lat: 11.4868, lng: 105.3253 },
      'Pursat': { lat: 12.5388, lng: 103.9192 },
      'Ratanakiri': { lat: 13.7394, lng: 106.9873 },
      'Stung Treng': { lat: 13.5259, lng: 105.9683 },
      'Svay Rieng': { lat: 11.0879, lng: 105.7993 },
      'Takéo': { lat: 10.9908, lng: 104.7849 },
      'Tboung Khmum': { lat: 11.9366, lng: 105.6593 },
    };

    const parseGeo = (
      rawAddress: string,
      province: string,
      fallbackLat: number,
      fallbackLng: number,
    ) => {
      if (!rawAddress) {
        return { lat: fallbackLat, lng: fallbackLng, address: `${province || 'Phnom Penh'}, Cambodia` };
      }
      const match = rawAddress.match(/\[geo:([0-9.-]+),([0-9.-]+)\]/);
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
          address: rawAddress.replace(/\[geo:[0-9.-]+,[0-9.-]+\]/, '').trim(),
        };
      }
      const provCoords = CAMBODIA_COORDS[province] || { lat: fallbackLat, lng: fallbackLng };
      return {
        lat: provCoords.lat,
        lng: provCoords.lng,
        address: rawAddress,
      };
    };

    // 1. Admin Central HQ
    const adminLocations = [
      {
        id: 'admin-hq-wat-phnom',
        name: 'BrightEyes Central HQ & Automated Lens Lab',
        role: 'ADMIN',
        category: 'Platform Headquarters & Rx Surfacing Lab',
        address: 'Street 96, Sangkat Wat Phnom, Khan Daun Penh',
        district: 'Daun Penh',
        province: 'Phnom Penh',
        phone: '+855 23 888 999',
        email: 'hq@brighteyes.com.kh',
        lat: 11.5761,
        lng: 104.9232,
        status: 'OPERATIONAL',
        verified: true,
        tag: 'Platform HQ',
        description: 'Nationwide prescription surfacing matrix hub, quality assurance lab, and optical logistics dispatch.',
      },
    ];

    // 2. Query Wholesalers from database
    const dbWholesalers = await this.prisma.wholesaler.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        _count: { select: { products: true, orders: true } },
      },
    });

    const wholesalers = dbWholesalers.map((w, idx) => {
      const fallbackGeo = parseGeo(
        w.businessAddress,
        w.province,
        11.5432 + (idx * 0.012),
        104.9123 + (idx * 0.015),
      );
      const lat = w.latitude ?? fallbackGeo.lat;
      const lng = w.longitude ?? fallbackGeo.lng;
      const cleanAddress = w.businessAddress
        ? w.businessAddress.replace(/\[geo:[0-9.-]+,[0-9.-]+\]/, '').trim()
        : fallbackGeo.address;

      return {
        id: w.id,
        name: w.companyName,
        role: 'WHOLESALER',
        category: 'Wholesale Optical Supplier',
        address: cleanAddress,
        district: w.district,
        province: w.province,
        phone: w.phone || w.user?.phone || '+855 12 345 678',
        email: w.email || w.user?.email || 'supplier@brighteyes.com',
        lat,
        lng,
        productsCount: w._count?.products || 0,
        ordersCount: w._count?.orders || 0,
        status: w.status,
        verified: true,
        tag: 'Wholesale Supplier',
        description: w.description || 'Verified importer and wholesale distributor of ophthalmic frames and lenses.',
      };
    });

    // 3. Query Retailers from database
    const dbRetailers = await this.prisma.retailer.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        _count: { select: { orders: true, retailerInventories: true } },
      },
    });

    const retailers = dbRetailers.map((r, idx) => {
      const fallbackGeo = parseGeo(
        r.storeAddress,
        r.province,
        11.5689 + (idx * 0.008),
        104.8912 + (idx * 0.011),
      );
      const lat = r.latitude ?? fallbackGeo.lat;
      const lng = r.longitude ?? fallbackGeo.lng;
      const cleanAddress = r.storeAddress
        ? r.storeAddress.replace(/\[geo:[0-9.-]+,[0-9.-]+\]/, '').trim()
        : fallbackGeo.address;

      return {
        id: r.id,
        name: r.storeName,
        role: 'RETAILER',
        category: 'Retail Optical Store & Optometry Clinic',
        address: cleanAddress,
        district: r.district,
        province: r.province,
        phone: r.phone || r.user?.phone || '+855 23 456 789',
        email: r.email || r.user?.email || 'retailer@brighteyes.com',
        lat,
        lng,
        ordersCount: r._count?.orders || 0,
        inventoryCount: r._count?.retailerInventories || 0,
        status: 'ACTIVE',
        verified: true,
        tag: 'Retail Optical Store',
        description: 'Certified optical dispensing boutique providing refractions and custom eyewear fitting.',
      };
    });

    return {
      admin: adminLocations,
      wholesalers,
      retailers,
      summary: {
        total: adminLocations.length + wholesalers.length + retailers.length,
        adminCount: adminLocations.length,
        wholesalersCount: wholesalers.length,
        retailersCount: retailers.length,
      },
    };
  }
}
