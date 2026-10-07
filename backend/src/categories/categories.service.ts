import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string; icon?: string }) {
    const existing = await this.prisma.productCategory.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException(`Category "${data.name}" already exists`);
    }

    return this.prisma.productCategory.create({ data });
  }

  async findAll() {
    return this.prisma.productCategory.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, data: { name?: string; description?: string; icon?: string }) {
    await this.findOne(id);
    return this.prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productCategory.delete({
      where: { id },
    });
  }
}
