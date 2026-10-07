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
}
