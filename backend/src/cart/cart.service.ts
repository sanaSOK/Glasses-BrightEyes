import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    const retailer = await this.prisma.retailer.findUnique({
      where: { userId },
    });

    if (!retailer) {
      throw new ForbiddenException('Only registered retailers can use the cart');
    }

    let cart = await this.prisma.cart.findUnique({
      where: { retailerId: retailer.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                wholesaler: true,
                images: true,
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { retailerId: retailer.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  wholesaler: true,
                  images: true,
                  inventory: true,
                },
              },
            },
          },
        },
      });
    }

    return { retailer, cart };
  }

  async getCart(userId: string) {
    const { cart } = await this.getOrCreateCart(userId);

    const formattedItems = cart.items.map((item) => {
      const quantity = item.product.inventory?.quantity ?? 0;
      const reservedQuantity = item.product.inventory?.reservedQuantity ?? 0;
      const availableQuantity = Math.max(0, quantity - reservedQuantity);

      return {
        ...item,
        availableStock: availableQuantity,
        isStockSufficient: availableQuantity >= item.quantity,
      };
    });

    const subtotal = formattedItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      retailerId: cart.retailerId,
      items: formattedItems,
      subtotal,
      itemCount: formattedItems.length,
      updatedAt: cart.updatedAt,
    };
  }

  async addItem(userId: string, dto: { productId: string; quantity: number }) {
    if (dto.quantity <= 0) {
      throw new BadRequestException('Item quantity must be greater than 0');
    }

    const { cart } = await this.getOrCreateCart(userId);

    // Fetch product strictly from Database to verify existence, status, and price
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true },
    });

    if (!product || product.status !== 'ACTIVE') {
      throw new NotFoundException('Product not found or currently inactive');
    }

    const quantity = product.inventory?.quantity ?? 0;
    const reservedQuantity = product.inventory?.reservedQuantity ?? 0;
    const availableQuantity = Math.max(0, quantity - reservedQuantity);

    // Check existing item in cart
    const existingItem = cart.items.find((i) => i.productId === dto.productId);
    const targetQuantity = existingItem ? existingItem.quantity + dto.quantity : dto.quantity;

    if (targetQuantity > availableQuantity) {
      throw new BadRequestException(
        `Insufficient stock for ${product.name}. Available: ${availableQuantity}, Requested: ${targetQuantity}`,
      );
    }

    // Always use database price
    const unitPrice = product.wholesalePrice || product.price;
    const subtotal = targetQuantity * unitPrice;

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: targetQuantity,
          price: unitPrice,
          subtotal,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
          price: unitPrice,
          subtotal: dto.quantity * unitPrice,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    const { cart } = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
      include: { inventory: true },
    });

    if (!product) {
      throw new NotFoundException('Product no longer exists');
    }

    const availableStock = Math.max(
      0,
      (product.inventory?.quantity ?? 0) - (product.inventory?.reservedQuantity ?? 0),
    );

    if (quantity > availableStock) {
      throw new BadRequestException(
        `Requested quantity (${quantity}) exceeds available stock (${availableStock})`,
      );
    }

    const unitPrice = product.wholesalePrice || product.price;

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        price: unitPrice,
        subtotal: quantity * unitPrice,
      },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const { cart } = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const { cart } = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getCart(userId);
  }
}
