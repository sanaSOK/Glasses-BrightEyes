import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async getByOrderId(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery for order ID ${orderId} not found`);
    }

    return delivery;
  }

  async updateDelivery(
    orderId: string,
    data: { trackingNumber?: string; status?: DeliveryStatus },
  ) {
    await this.getByOrderId(orderId);

    return this.prisma.delivery.update({
      where: { orderId },
      data,
    });
  }
}
