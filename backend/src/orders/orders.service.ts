import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Role, DeliveryStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const retailer = await this.prisma.retailer.findUnique({
      where: { userId },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    inventory: true,
                    wholesaler: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!retailer) {
      throw new ForbiddenException('Only registered retailers can place orders');
    }

    const cart = retailer.cart;
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Shopping cart is empty');
    }

    // Group cart items by Wholesaler
    const itemsByWholesaler: { [wholesalerId: string]: typeof cart.items } = {};

    for (const item of cart.items) {
      if (!item.product || item.product.status !== 'ACTIVE') {
        throw new BadRequestException(
          `Product "${item.product?.name || item.productId}" is inactive or unavailable`,
        );
      }

      const inv = item.product.inventory;
      if (!inv) {
        throw new BadRequestException(`No inventory record for product ${item.product.name}`);
      }

      const availableQuantity = Math.max(0, inv.quantity - inv.reservedQuantity);
      if (item.quantity > availableQuantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.product.name}". Available: ${availableQuantity}, Requested: ${item.quantity}`,
        );
      }

      const wId = item.product.wholesalerId;
      if (!itemsByWholesaler[wId]) {
        itemsByWholesaler[wId] = [];
      }
      itemsByWholesaler[wId].push(item);
    }

    const createdOrders = [];

    // Create B2B orders per wholesaler using Prisma Transactions
    for (const [wholesalerId, items] of Object.entries(itemsByWholesaler)) {
      const order = await this.prisma.$transaction(async (tx) => {
        let subtotal = 0;

        // 1. Double check stock and reserve inventory
        for (const item of items) {
          const inv = await tx.inventory.findUnique({
            where: { productId: item.productId },
          });

          if (!inv) {
            throw new BadRequestException(`Inventory for product ${item.product.name} not found`);
          }

          const availableQuantity = Math.max(0, inv.quantity - inv.reservedQuantity);
          if (item.quantity > availableQuantity) {
            throw new BadRequestException(
              `Insufficient stock for "${item.product.name}". Available: ${availableQuantity}, Requested: ${item.quantity}`,
            );
          }

          // Atomic reserve stock increment
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              reservedQuantity: { increment: item.quantity },
            },
          });

          const currentPrice = item.product.wholesalePrice || item.product.price;
          subtotal += item.quantity * currentPrice;
        }

        const deliveryFee = 5.0; // Standard flat B2B optical delivery fee in USD
        const total = subtotal + deliveryFee;

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `BE-${dateStr}-${randomNum}`;

        // 2. Create Order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            retailerId: retailer.id,
            wholesalerId,
            subtotal,
            deliveryFee,
            total,
            orderStatus: OrderStatus.PENDING,
            shippingAddress: dto.shippingAddress,
            province: dto.province,
            district: dto.district,
            commune: dto.commune,
            phone: dto.phone,
            notes: dto.notes,
            orderItems: {
              create: items.map((i) => ({
                productId: i.productId,
                SKU: i.product.SKU,
                productName: i.product.name,
                quantity: i.quantity,
                price: i.product.wholesalePrice || i.product.price,
                subtotal: i.quantity * (i.product.wholesalePrice || i.product.price),
              })),
            },
          },
        });

        // 3. Create Delivery record
        await tx.delivery.create({
          data: {
            orderId: newOrder.id,
            deliveryMethod: dto.deliveryMethod || 'DELIVERY',
            deliveryAddress: dto.shippingAddress,
            province: dto.province,
            district: dto.district,
            commune: dto.commune,
            phone: dto.phone,
            status: DeliveryStatus.PENDING,
          },
        });

        // 4. Remove processed items from cart
        const itemIdsToRemove = items.map((i) => i.id);
        await tx.cartItem.deleteMany({
          where: { id: { in: itemIdsToRemove } },
        });

        return newOrder;
      });

      createdOrders.push(order);
    }

    return createdOrders.length === 1 ? createdOrders[0] : createdOrders;
  }

  async findAll(userId: string, role: Role, statusFilter?: OrderStatus) {
    const where: any = {};

    if (statusFilter) {
      where.orderStatus = statusFilter;
    }

    if (role === Role.WHOLESALER) {
      const wholesaler = await this.prisma.wholesaler.findUnique({
        where: { userId },
      });
      if (!wholesaler) return [];
      where.wholesalerId = wholesaler.id;
    } else if (role === Role.RETAILER) {
      const retailer = await this.prisma.retailer.findUnique({
        where: { userId },
      });
      if (!retailer) return [];
      where.retailerId = retailer.id;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        retailer: true,
        wholesaler: true,
        orderItems: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        delivery: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        retailer: {
          include: { user: { select: { name: true, email: true, phone: true } } },
        },
        wholesaler: {
          include: { user: { select: { name: true, email: true, phone: true } } },
        },
        orderItems: {
          include: {
            product: {
              include: { images: true, category: true },
            },
          },
        },
        delivery: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Access control check
    if (role === Role.WHOLESALER && order.wholesaler.userId !== userId) {
      throw new ForbiddenException('You can only view orders assigned to your company');
    }
    if (role === Role.RETAILER && order.retailer.userId !== userId) {
      throw new ForbiddenException('You can only view your own store orders');
    }

    return order;
  }

  async updateOrderStatus(id: string, newStatus: OrderStatus, userId: string, role: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        wholesaler: true,
        retailer: true,
        delivery: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Authorization check: Wholesaler processes, Retailer can cancel pending
    if (role === Role.RETAILER) {
      if (order.retailer.userId !== userId) {
        throw new ForbiddenException('Unauthorized to modify this order');
      }
      if (newStatus !== OrderStatus.CANCELLED || order.orderStatus !== OrderStatus.PENDING) {
        throw new BadRequestException('Retailers can only cancel orders in PENDING status');
      }
    } else if (role === Role.WHOLESALER) {
      if (order.wholesaler.userId !== userId) {
        throw new ForbiddenException('Unauthorized to modify this order');
      }
    }

    const currentStatus = order.orderStatus;
    if (currentStatus === OrderStatus.DELIVERED || currentStatus === OrderStatus.CANCELLED || currentStatus === OrderStatus.REJECTED) {
      throw new BadRequestException(`Cannot change status of an order that is already ${currentStatus}`);
    }

    return this.prisma.$transaction(async (tx) => {
      // If CANCELLED or REJECTED: release reserved stock
      if (newStatus === OrderStatus.CANCELLED || newStatus === OrderStatus.REJECTED) {
        for (const item of order.orderItems) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              reservedQuantity: { decrement: item.quantity },
            },
          });
        }

        if (order.delivery) {
          await tx.delivery.update({
            where: { id: order.delivery.id },
            data: { status: DeliveryStatus.CANCELLED },
          });
        }
      }

      // If DELIVERED: deduct actual stock & reserved stock, then update Retailer Inventory
      if (newStatus === OrderStatus.DELIVERED) {
        for (const item of order.orderItems) {
          // 1. Deduct stock from Wholesaler Inventory
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              quantity: { decrement: item.quantity },
              reservedQuantity: { decrement: item.quantity },
            },
          });

          // 2. Add stock to Retailer Inventory ledger (Phase 1 POS foundation)
          await tx.retailerInventory.upsert({
            where: {
              retailerId_productId: {
                retailerId: order.retailerId,
                productId: item.productId,
              },
            },
            update: {
              quantity: { increment: item.quantity },
            },
            create: {
              retailerId: order.retailerId,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }

        if (order.delivery) {
          await tx.delivery.update({
            where: { id: order.delivery.id },
            data: { status: DeliveryStatus.DELIVERED },
          });
        }
      }

      // Synchronize Delivery status on SHIPPED or IN_TRANSIT
      if (newStatus === OrderStatus.SHIPPED && order.delivery) {
        await tx.delivery.update({
          where: { id: order.delivery.id },
          data: { status: DeliveryStatus.IN_TRANSIT },
        });
      }

      return tx.order.update({
        where: { id },
        data: { orderStatus: newStatus },
        include: {
          orderItems: { include: { product: true } },
          retailer: true,
          wholesaler: true,
          delivery: true,
        },
      });
    });
  }
}
