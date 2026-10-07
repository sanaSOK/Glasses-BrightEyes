import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductType, ProductStatus, Role } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProductDto) {
    const wholesaler = await this.prisma.wholesaler.findUnique({
      where: { userId },
    });

    if (!wholesaler) {
      throw new ForbiddenException('Only registered wholesalers can create products');
    }

    const existingSku = await this.prisma.product.findUnique({
      where: { SKU: dto.SKU },
    });

    if (existingSku) {
      throw new ConflictException(`Product SKU "${dto.SKU}" already exists`);
    }

    const images = dto.images || [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    ];

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          SKU: dto.SKU,
          name: dto.name,
          description: dto.description,
          categoryId: dto.categoryId,
          wholesalerId: wholesaler.id,
          brand: dto.brand,
          productType: dto.productType || ProductType.FRAME,
          model: dto.model,
          color: dto.color,
          size: dto.size,
          material: dto.material,
          gender: dto.gender || 'UNISEX',
          price: dto.price,
          wholesalePrice: dto.wholesalePrice,
          status: dto.quantity > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK,
        },
      });

      // Create Product Images
      await Promise.all(
        images.map((url, idx) =>
          tx.productImage.create({
            data: {
              productId: product.id,
              imageUrl: url,
              isPrimary: idx === 0,
            },
          }),
        ),
      );

      // Create Inventory Record
      const inventory = await tx.inventory.create({
        data: {
          productId: product.id,
          wholesalerId: wholesaler.id,
          quantity: dto.quantity,
          reservedQuantity: 0,
          lowStockThreshold: dto.lowStockThreshold || 10,
        },
      });

      return this.formatProduct({
        ...product,
        images: images.map((url, idx) => ({ id: `${idx}`, productId: product.id, imageUrl: url, isPrimary: idx === 0, createdAt: new Date() })),
        inventory,
        wholesaler,
      });
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    productType?: ProductType;
    wholesalerId?: string;
    availableOnly?: boolean;
    userRole?: Role;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Retailers can only view ACTIVE products
    if (query.userRole === Role.RETAILER) {
      where.status = ProductStatus.ACTIVE;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { SKU: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
        { model: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.categoryId = query.category;
    }

    if (query.brand) {
      where.brand = { equals: query.brand, mode: 'insensitive' };
    }

    if (query.productType) {
      where.productType = query.productType;
    }

    if (query.wholesalerId) {
      where.wholesalerId = query.wholesalerId;
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          wholesaler: true,
          images: true,
          inventory: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    let formattedProducts = products.map((p) => this.formatProduct(p));

    if (query.availableOnly) {
      formattedProducts = formattedProducts.filter(
        (p) => p.inventory && p.inventory.availableQuantity > 0,
      );
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: formattedProducts,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        wholesaler: true,
        images: true,
        inventory: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.formatProduct(product);
  }

  async update(id: string, userId: string, dto: UpdateProductDto, userRole?: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { wholesaler: true, inventory: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (userRole !== Role.SUPER_ADMIN && product.wholesaler.userId !== userId) {
      throw new ForbiddenException('Wholesalers can only modify their own products');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          categoryId: dto.categoryId,
          brand: dto.brand,
          productType: dto.productType,
          model: dto.model,
          color: dto.color,
          size: dto.size,
          material: dto.material,
          gender: dto.gender,
          price: dto.price,
          wholesalePrice: dto.wholesalePrice,
          status: dto.status,
        },
        include: {
          category: true,
          wholesaler: true,
          images: true,
          inventory: true,
        },
      });

      if (dto.quantity !== undefined && product.inventory) {
        await tx.inventory.update({
          where: { productId: id },
          data: {
            quantity: dto.quantity,
            lowStockThreshold: dto.lowStockThreshold ?? product.inventory.lowStockThreshold,
          },
        });
      }

      const refreshed = await tx.product.findUnique({
        where: { id },
        include: { category: true, wholesaler: true, images: true, inventory: true },
      });

      return this.formatProduct(refreshed);
    });
  }

  async remove(id: string, userId: string, userRole?: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { wholesaler: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (userRole !== Role.SUPER_ADMIN && product.wholesaler.userId !== userId) {
      throw new ForbiddenException('Wholesalers can only delete their own products');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  private formatProduct(product: any) {
    if (!product) return null;
    const quantity = product.inventory?.quantity ?? 0;
    const reservedQuantity = product.inventory?.reservedQuantity ?? 0;
    const availableQuantity = Math.max(0, quantity - reservedQuantity);
    const lowStockThreshold = product.inventory?.lowStockThreshold ?? 10;

    let stockStatus = 'In Stock';
    if (availableQuantity === 0) {
      stockStatus = 'Out of Stock';
    } else if (availableQuantity <= lowStockThreshold) {
      stockStatus = 'Low Stock';
    }

    return {
      ...product,
      inventory: product.inventory
        ? {
            ...product.inventory,
            availableQuantity,
            stockStatus,
          }
        : null,
    };
  }
}
