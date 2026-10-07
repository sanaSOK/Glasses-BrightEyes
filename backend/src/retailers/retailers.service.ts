import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RetailersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.retailer.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        stores: true,
        _count: { select: { orders: true, retailerInventories: true } },
      },
      orderBy: { storeName: 'asc' },
    });
  }

  async findOne(id: string) {
    const retailer = await this.prisma.retailer.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        stores: true,
      },
    });

    if (!retailer) {
      throw new NotFoundException(`Retailer with ID ${id} not found`);
    }

    return retailer;
  }

  async updateProfile(userId: string, data: any) {
    const retailer = await this.prisma.retailer.findUnique({
      where: { userId },
    });

    if (!retailer) {
      throw new NotFoundException('Retailer profile not found');
    }

    return this.prisma.retailer.update({
      where: { id: retailer.id },
      data,
    });
  }
}
