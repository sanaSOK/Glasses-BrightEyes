import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFrameDto, FrameAccessoryDto, FramePictureDto, FrameVariantDto } from './dto/create-frame.dto';
import { UpdateFrameDto } from './dto/update-frame.dto';
import { FrameQueryDto } from './dto/frame-query.dto';

@Injectable()
export class FramesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string | null, dto: CreateFrameDto) {
    let wholesalerId: string | undefined = undefined;

    if (userId) {
      const wholesaler = await this.prisma.wholesaler.findUnique({
        where: { userId },
      });
      if (wholesaler) {
        wholesalerId = wholesaler.id;
      }
    }

    // Default accessories from wireframe if none provided
    const accessoriesList: FrameAccessoryDto[] =
      dto.accessories && dto.accessories.length > 0
        ? dto.accessories
        : [
            { name: 'Case', isIncluded: true },
            { name: 'Bag', isIncluded: true },
            { name: 'Clean pad', isIncluded: true },
            { name: 'Warranty Card', isIncluded: true },
            { name: 'Clip', isIncluded: true },
            { name: 'Others', isIncluded: true },
          ];

    // Compute total quantity if group frame variants exist
    let totalQty = dto.quantity || 0;
    if (dto.variants && dto.variants.length > 0) {
      const variantSum = dto.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
      if (variantSum > 0) {
        totalQty = variantSum;
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const frame = await tx.frameItem.create({
        data: {
          wholesalerId,
          entryType: dto.entryType || (dto.variants && dto.variants.length > 1 ? 'GROUP' : 'SINGLE'),
          brand: dto.brand,
          model: dto.model,
          code: dto.code || (dto.variants?.[0]?.code ?? 'C1'),
          category: dto.category || 'Eyeglasses',
          gender: dto.gender || 'Unisex',
          type: dto.type || 'Full-rim',
          material: dto.material || 'Plastic',
          kindOfMaterial: dto.kindOfMaterial,
          frameShape: dto.frameShape,
          isPolarized: Boolean(dto.isPolarized),
          detail: dto.detail,

          // Boxing notation & dimensions
          boxingNotation: dto.boxingNotation || `${dto.lensWidthA || 52} ▢ ${dto.bridgeDbl || 17} – 147`,
          lensWidthA: dto.lensWidthA !== undefined ? Number(dto.lensWidthA) : null,
          lensHeightB: dto.lensHeightB !== undefined ? Number(dto.lensHeightB) : null,
          effectiveDiaEd: dto.effectiveDiaEd !== undefined ? Number(dto.effectiveDiaEd) : null,
          bridgeDbl: dto.bridgeDbl !== undefined ? Number(dto.bridgeDbl) : null,
          lensDia: dto.lensDia !== undefined ? Number(dto.lensDia) : null,
          pupillaryDistanceFpd: dto.pupillaryDistanceFpd !== undefined ? Number(dto.pupillaryDistanceFpd) : null,
          frameSize: dto.frameSize || 'M',

          quantity: totalQty,
          price: dto.price !== undefined ? Number(dto.price) : 85,
          wholesalePrice: dto.wholesalePrice !== undefined ? Number(dto.wholesalePrice) : 45,
          status: dto.status || 'ACTIVE',
        },
      });

      // Pictures
      if (dto.pictures && dto.pictures.length > 0) {
        for (let i = 0; i < dto.pictures.length; i++) {
          const pic = dto.pictures[i];
          const url = typeof pic === 'string' ? pic : pic.url;
          const isPrimary = typeof pic === 'string' ? i === 0 : Boolean(pic.isPrimary);
          const sortOrder = typeof pic === 'string' ? i : pic.sortOrder || i;

          if (url && url.trim().length > 0) {
            await tx.framePicture.create({
              data: {
                frameId: frame.id,
                url,
                isPrimary,
                sortOrder,
              },
            });
          }
        }
      } else {
        // Default optical frame placeholder
        await tx.framePicture.create({
          data: {
            frameId: frame.id,
            url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
            isPrimary: true,
            sortOrder: 0,
          },
        });
      }

      // Accessories
      for (const acc of accessoriesList) {
        if (acc.name) {
          await tx.frameAccessoryItem.create({
            data: {
              frameId: frame.id,
              name: acc.name,
              isIncluded: acc.isIncluded !== undefined ? acc.isIncluded : true,
              picUrl: acc.picUrl || null,
            },
          });
        }
      }

      // Variants (Group frames or multiple color codes)
      if (dto.variants && dto.variants.length > 0) {
        for (const v of dto.variants) {
          await tx.frameVariantItem.create({
            data: {
              frameId: frame.id,
              code: v.code,
              colorName: v.colorName || `Color ${v.code}`,
              quantity: Number(v.quantity) || 0,
              sku: v.sku || `${frame.model}-${v.code}`,
              picUrl: v.picUrl || null,
            },
          });
        }
      } else if (dto.code) {
        // Single frame variant
        await tx.frameVariantItem.create({
          data: {
            frameId: frame.id,
            code: dto.code,
            colorName: `Color ${dto.code}`,
            quantity: totalQty,
            sku: `${frame.model}-${dto.code}`,
          },
        });
      }

      return this.findOne(frame.id, tx);
    });
  }

  async findAll(query: FrameQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.entryType) {
      where.entryType = query.entryType;
    }
    if (query.brand) {
      where.brand = { contains: query.brand, mode: 'insensitive' };
    }
    if (query.model) {
      where.model = { contains: query.model, mode: 'insensitive' };
    }
    if (query.category && query.category !== 'All') {
      where.category = query.category;
    }
    if (query.gender && query.gender !== 'All') {
      where.gender = query.gender;
    }
    if (query.type && query.type !== 'All') {
      where.type = query.type;
    }
    if (query.material && query.material !== 'All') {
      where.material = query.material;
    }
    if (query.frameShape && query.frameShape !== 'All') {
      where.frameShape = query.frameShape;
    }
    if (query.wholesalerId) {
      where.wholesalerId = query.wholesalerId;
    }

    if (query.search && query.search.trim().length > 0) {
      const term = query.search.trim();
      where.OR = [
        { brand: { contains: term, mode: 'insensitive' } },
        { model: { contains: term, mode: 'insensitive' } },
        { code: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { detail: { contains: term, mode: 'insensitive' } },
        { kindOfMaterial: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.frameItem.count({ where }),
      this.prisma.frameItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          pictures: { orderBy: { sortOrder: 'asc' } },
          accessories: true,
          variants: { orderBy: { code: 'asc' } },
          wholesaler: {
            select: { id: true, companyName: true, phone: true },
          },
        },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, customPrisma?: any) {
    const client = customPrisma || this.prisma;
    const frame = await client.frameItem.findUnique({
      where: { id },
      include: {
        pictures: { orderBy: { sortOrder: 'asc' } },
        accessories: true,
        variants: { orderBy: { code: 'asc' } },
        wholesaler: {
          select: { id: true, companyName: true, phone: true },
        },
      },
    });

    if (!frame) {
      throw new NotFoundException(`Frame with ID "${id}" was not found`);
    }

    return frame;
  }

  async update(id: string, dto: UpdateFrameDto) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const updateData: any = {};

      if (dto.brand !== undefined) updateData.brand = dto.brand;
      if (dto.model !== undefined) updateData.model = dto.model;
      if (dto.code !== undefined) updateData.code = dto.code;
      if (dto.category !== undefined) updateData.category = dto.category;
      if (dto.gender !== undefined) updateData.gender = dto.gender;
      if (dto.type !== undefined) updateData.type = dto.type;
      if (dto.material !== undefined) updateData.material = dto.material;
      if (dto.kindOfMaterial !== undefined) updateData.kindOfMaterial = dto.kindOfMaterial;
      if (dto.frameShape !== undefined) updateData.frameShape = dto.frameShape;
      if (dto.isPolarized !== undefined) updateData.isPolarized = dto.isPolarized;
      if (dto.detail !== undefined) updateData.detail = dto.detail;
      if (dto.entryType !== undefined) updateData.entryType = dto.entryType;

      // Boxing dimensions
      if (dto.boxingNotation !== undefined) updateData.boxingNotation = dto.boxingNotation;
      if (dto.lensWidthA !== undefined) updateData.lensWidthA = Number(dto.lensWidthA);
      if (dto.lensHeightB !== undefined) updateData.lensHeightB = Number(dto.lensHeightB);
      if (dto.effectiveDiaEd !== undefined) updateData.effectiveDiaEd = Number(dto.effectiveDiaEd);
      if (dto.bridgeDbl !== undefined) updateData.bridgeDbl = Number(dto.bridgeDbl);
      if (dto.lensDia !== undefined) updateData.lensDia = Number(dto.lensDia);
      if (dto.pupillaryDistanceFpd !== undefined) updateData.pupillaryDistanceFpd = Number(dto.pupillaryDistanceFpd);
      if (dto.frameSize !== undefined) updateData.frameSize = dto.frameSize;

      if (dto.price !== undefined) updateData.price = Number(dto.price);
      if (dto.wholesalePrice !== undefined) updateData.wholesalePrice = Number(dto.wholesalePrice);
      if (dto.status !== undefined) updateData.status = dto.status;

      // Variants update
      if (dto.variants && dto.variants.length > 0) {
        await tx.frameVariantItem.deleteMany({ where: { frameId: id } });
        const variantSum = dto.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
        updateData.quantity = variantSum;

        for (const v of dto.variants) {
          await tx.frameVariantItem.create({
            data: {
              frameId: id,
              code: v.code,
              colorName: v.colorName || `Color ${v.code}`,
              quantity: Number(v.quantity) || 0,
              sku: v.sku || `${dto.model || 'FRAME'}-${v.code}`,
              picUrl: v.picUrl || null,
            },
          });
        }
      } else if (dto.quantity !== undefined) {
        updateData.quantity = Number(dto.quantity);
      }

      // Accessories update
      if (dto.accessories && dto.accessories.length > 0) {
        await tx.frameAccessoryItem.deleteMany({ where: { frameId: id } });
        for (const acc of dto.accessories) {
          await tx.frameAccessoryItem.create({
            data: {
              frameId: id,
              name: acc.name,
              isIncluded: acc.isIncluded !== undefined ? acc.isIncluded : true,
              picUrl: acc.picUrl || null,
            },
          });
        }
      }

      // Pictures update
      if (dto.pictures && dto.pictures.length > 0) {
        await tx.framePicture.deleteMany({ where: { frameId: id } });
        for (let i = 0; i < dto.pictures.length; i++) {
          const pic = dto.pictures[i];
          const url = typeof pic === 'string' ? pic : pic.url;
          const isPrimary = typeof pic === 'string' ? i === 0 : Boolean(pic.isPrimary);
          const sortOrder = typeof pic === 'string' ? i : pic.sortOrder || i;

          if (url && url.trim().length > 0) {
            await tx.framePicture.create({
              data: {
                frameId: id,
                url,
                isPrimary,
                sortOrder,
              },
            });
          }
        }
      }

      await tx.frameItem.update({
        where: { id },
        data: updateData,
      });

      return this.findOne(id, tx);
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.frameItem.delete({
      where: { id },
    });
    return { success: true, message: `Frame ${id} deleted successfully` };
  }

  async getStats() {
    const [totalFrames, singleFrames, groupFrames, totalQuantityAgg, categoryCounts] = await Promise.all([
      this.prisma.frameItem.count(),
      this.prisma.frameItem.count({ where: { entryType: 'SINGLE' } }),
      this.prisma.frameItem.count({ where: { entryType: 'GROUP' } }),
      this.prisma.frameItem.aggregate({ _sum: { quantity: true } }),
      this.prisma.frameItem.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
    ]);

    return {
      totalFrames,
      singleFrames,
      groupFrames,
      totalQuantity: totalQuantityAgg._sum.quantity || 0,
      categories: categoryCounts.map((c) => ({ category: c.category, count: c._count.id })),
    };
  }

  async seedWireframeExample() {
    const existing = await this.prisma.frameItem.findFirst({
      where: { model: 'OLV1201', brand: 'Oleva' },
    });

    if (existing) {
      return existing;
    }

    // Seed the Oleva wireframe example from the PDF
    return this.create(null, {
      entryType: 'GROUP',
      brand: 'Oleva',
      model: 'OLV1201',
      code: 'C4',
      category: 'Eyeglasses',
      gender: 'Unisex',
      type: 'Full-rim',
      material: 'Plastic',
      kindOfMaterial: 'Celluloid',
      frameShape: 'Rectangle',
      isPolarized: false,
      detail: 'Oleva Spring Collection - Lightweight cellulose acetate with ergonomic bridge & premium hinge structure.',
      boxingNotation: '52 ▢ 17 – 147',
      lensWidthA: 52,
      lensHeightB: 38,
      effectiveDiaEd: 58,
      bridgeDbl: 18,
      lensDia: 60,
      pupillaryDistanceFpd: 72,
      frameSize: 'M',
      quantity: 100,
      price: 85,
      wholesalePrice: 42,
      pictures: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
      ],
      accessories: [
        { name: 'Case', isIncluded: true, picUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=200&q=80' },
        { name: 'Bag', isIncluded: true, picUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=200&q=80' },
        { name: 'Clean pad', isIncluded: true },
        { name: 'Warranty Card', isIncluded: true },
        { name: 'Clip', isIncluded: true },
        { name: 'Others', isIncluded: true },
      ],
      variants: [
        { code: 'C1', colorName: 'Piano Black', quantity: 20 },
        { code: 'C2', colorName: 'Demi Amber', quantity: 20 },
        { code: 'C3', colorName: 'Smoke Grey', quantity: 20 },
        { code: 'C4', colorName: 'Olive Crystal', quantity: 40 },
      ],
    });
  }
}
