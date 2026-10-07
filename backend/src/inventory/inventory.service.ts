import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getWholesalerInventory(userId: string) {
    const wholesaler = await this.prisma.wholesaler.findUnique({
      where: { userId },
    });

    if (!wholesaler) {
      throw new ForbiddenException('User is not a registered wholesaler');
    }

    const inventories = await this.prisma.inventory.findMany({
      where: { wholesalerId: wholesaler.id },
      include: {
        product: {
          include: { category: true, images: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return inventories.map((inv) => {
      const availableQuantity = Math.max(0, inv.quantity - inv.reservedQuantity);
      let stockStatus = 'In Stock';
      if (availableQuantity === 0) stockStatus = 'Out of Stock';
      else if (availableQuantity <= inv.lowStockThreshold) stockStatus = 'Low Stock';

      return {
        ...inv,
        availableQuantity,
        stockStatus,
      };
    });
  }

  async updateStock(
    userId: string,
    productId: string,
    quantity: number,
    lowStockThreshold?: number,
  ) {
    const wholesaler = await this.prisma.wholesaler.findUnique({
      where: { userId },
    });

    if (!wholesaler) {
      throw new ForbiddenException('User is not a registered wholesaler');
    }

    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory || inventory.wholesalerId !== wholesaler.id) {
      throw new NotFoundException('Inventory item not found or unauthorized');
    }

    const updated = await this.prisma.inventory.update({
      where: { productId },
      data: {
        quantity,
        lowStockThreshold: lowStockThreshold ?? inventory.lowStockThreshold,
      },
      include: { product: true },
    });

    // Update Product Status if quantity changed
    const availableQuantity = Math.max(0, updated.quantity - updated.reservedQuantity);
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        status: availableQuantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
      },
    });

    return {
      ...updated,
      availableQuantity,
    };
  }

  async getRetailerInventory(userId: string) {
    const retailer = await this.prisma.retailer.findUnique({
      where: { userId },
    });

    if (!retailer) {
      throw new ForbiddenException('User is not a registered retailer');
    }

    return this.prisma.retailerInventory.findMany({
      where: { retailerId: retailer.id },
      include: {
        product: {
          include: {
            category: true,
            wholesaler: true,
            images: true,
          },
        },
      },
      orderBy: { lastUpdated: 'desc' },
    });
  }
}
