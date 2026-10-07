import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalUsers,
      totalWholesalers,
      totalRetailers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalCategories,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.wholesaler.count(),
      this.prisma.retailer.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { orderStatus: 'PENDING' } }),
      this.prisma.productCategory.count(),
    ]);

    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { retailer: true, wholesaler: true },
    });

    return {
      totalUsers,
      totalWholesalers,
      totalRetailers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalCategories,
      recentOrders,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true,
        wholesaler: true,
        retailer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleUserActive(userId: string, active: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { active },
      select: { id: true, email: true, active: true },
    });
  }
}
